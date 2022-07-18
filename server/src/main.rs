use actix_files as fs;
use actix_web::{App, HttpServer, HttpRequest, web, Result};
use simple_logger::SimpleLogger;
use std::str::FromStr;
use std::path::PathBuf;

const STATIC_ASSETS_PATH: &'static str = "../client/dist";

async fn index(req: HttpRequest) -> Result<fs::NamedFile> {
    let conn_info = req.connection_info();
    if let Some(ip) = conn_info.realip_remote_addr() {
        log::info!("ip={ip}");
    }

    let file_path: PathBuf = [STATIC_ASSETS_PATH, "index.html"].iter().collect();
    Ok(fs::NamedFile::open(file_path)?)
}

fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(fs::Files::new("/static", STATIC_ASSETS_PATH).show_files_listing());
    cfg.service(web::resource("/").route(web::get().to(index)));
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv::dotenv().ok();

    SimpleLogger::new().with_level(log::LevelFilter::Info).init().unwrap();

    let host = if let Ok(h) = dotenv::var("HOST") {
        h
    } else {
        "127.0.0.1".to_string()
    };

    let port = if let Ok(ref p) = dotenv::var("PORT") {
        u16::from_str(p).unwrap()
    } else {
        3000
    };

    log::info!("Listening on tcp://{}:{}", &host, &port);

    HttpServer::new(|| App::new().configure(config))
        .bind((host, port))?
        .run()
        .await
}
