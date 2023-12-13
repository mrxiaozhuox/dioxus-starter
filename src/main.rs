#![allow(non_snake_case)]

use dioxus::prelude::*;
use dioxus_router::prelude::*;
use dioxus_toast::{ToastFrame, ToastManager};

mod components;
mod hooks;
mod pages;

use fermi::{use_atom_ref, use_init_atom_root, AtomRef};
use hooks::mode::init_mode_info;
use pages::_404::NotFound;
use pages::starter::{About, HelloDioxus, SayHi};

static TOAST_MANAGER: AtomRef<ToastManager> = AtomRef(|_| ToastManager::default());

#[derive(Clone, Debug, PartialEq, Routable)]
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
    log::info!("Dioxus Starter: https://github.com/mrxiaozhuox/dioxus-starter");
    dioxus_web::launch(App)
}

fn App(cx: Scope) -> Element {
    // init fermi atom root
    use_init_atom_root(&cx);

    // init mode information
    init_mode_info(&cx);

    cx.render(rsx! {
        // dioxus toast manager init
        ToastFrame { manager: use_atom_ref(&cx, &TOAST_MANAGER) }
        // dioxus router init
        Router::<Route> { }
    })
}
