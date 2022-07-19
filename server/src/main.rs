use actix_files as fs;
use actix_web::{App, HttpServer, HttpRequest, web, Result};
use simple_logger::SimpleLogger;
use std::io;
use std::net::{Ipv4Addr, SocketAddrV4};
use std::path::PathBuf;

const STATIC_ASSETS_PATH: &'static str = "./www";

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
async fn main() -> io::Result<()> {
    dotenv::dotenv().ok();

    SimpleLogger::new().with_level(log::LevelFilter::Info).init().unwrap();

    let host = dotenv::var("HOST")
        .map(|host_str| {
            host_str
                .parse::<Ipv4Addr>()
                .unwrap_or(Ipv4Addr::new(0, 0, 0, 0))
        })
        .unwrap();

    let port = dotenv::var("PORT")
        .unwrap_or("3000".to_string())
        .parse::<u16>()
        .unwrap();

    let socketaddr = SocketAddrV4::new(host, port);

    log::info!("Listening on tcp://{}", &socketaddr);

    HttpServer::new(|| App::new().configure(config))
        .bind(socketaddr)?
        .run()
        .await
}
