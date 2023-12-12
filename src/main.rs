#![allow(non_snake_case)]

use dioxus::prelude::*;
use dioxus_router::prelude::*;
use dioxus_toast::{ToastFrame, ToastManager};

mod components;
mod hooks;
mod pages;

use fermi::{use_atom_ref, use_init_atom_root, AtomRef};
use hooks::mode::init_mode_info;
use pages::starter::{About, HelloDioxus, SayHi};

static TOAST_MANAGER: AtomRef<ToastManager> = AtomRef(|_| ToastManager::default());

#[derive(Clone, Debug, PartialEq, Routable)]
enum Route {
    #[route("/")]
    HelloDioxus {},
    #[route("/hi/:name")]
    SayHi { name: String },
    #[route("/about")]
    About {},
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
        // dioxus router info
        Router::<Route> {
            // Route { to: "/", HelloDioxus {} }
            // Route { to: "/hi/:name", SayHi {} }
            // Route { to: "/about", About {} }
            // // 404 page
            // Route { to: "", pages::_404::NotFound {} }
        }
    })
}
