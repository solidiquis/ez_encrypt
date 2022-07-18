use actix_files as fs;
use actix_web::{App, HttpServer, HttpRequest, web, Result};
use std::path::PathBuf;

const STATIC_ASSETS_PATH: &'static str = "../client/dist";

async fn index(_req: HttpRequest) -> Result<fs::NamedFile> {
    let file_path: PathBuf = [STATIC_ASSETS_PATH, "index.html"].iter().collect();
    Ok(fs::NamedFile::open(file_path)?)
}

fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(fs::Files::new("/static", STATIC_ASSETS_PATH).show_files_listing());
    cfg.service(web::resource("/").route(web::get().to(index)));
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| App::new().configure(config))
        .bind(("127.0.0.1", 3000))?
        .run()
        .await
}
