#![allow(non_snake_case)]

use dioxus::prelude::*;
use dioxus_toast::{ToastFrame, ToastManager};

mod components;
mod hooks;
mod pages;

use hooks::mode::init_mode_info;
use pages::_404::NotFound;
use pages::starter::{About, HelloDioxus, SayHi};

#[derive(Routable, Clone, Debug, PartialEq)]
enum Route {
    // Main Page
    #[route("/")]
    HelloDioxus {},
    
    // Say Hi Page
    #[route("/hi/:name")]
    SayHi { name: String },
    
    // About Page
    #[route("/about")]
    About {},

    // 404 Not Found Page
    #[route("/:route")]
    NotFound { route: String },
}

fn main() {
    
    wasm_logger::init(wasm_logger::Config::default());

    dioxus_sdk::storage::set_dir!();

    log::info!("Dioxus Starter: https://github.com/mrxiaozhuox/dioxus-starter");
    launch(App)
}

fn App() -> Element {
    // init mode information
    init_mode_info();

    let toast = use_context_provider(|| Signal::new(ToastManager::default()));

    rsx! {
        // dioxus toast manager init
        ToastFrame { manager: toast }
        Router::<Route> {}
    }
}
