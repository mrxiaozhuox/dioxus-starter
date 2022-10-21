#![allow(non_snake_case)]

use dioxus::prelude::*;
use dioxus_toast::{ToastFrame, ToastManager};

mod components;
mod hooks;
mod pages;

use hooks::mode::init_mode_info;
use pages::starter::{About, HelloDioxus, SayHi};

static TOAST_MANAGER: dioxus::fermi::AtomRef<ToastManager> = |_| ToastManager::default();

fn main() {
    wasm_logger::init(wasm_logger::Config::default());
    log::info!("Dioxus Starter: https://github.com/mrxiaozhuox/dioxus-starter");
    dioxus::web::launch(App)
}

fn App(cx: Scope) -> Element {
    // init mode information
    init_mode_info(&cx);
    
    cx.render(rsx! {
        // dioxus toast manager init
        ToastFrame {
            manager: use_atom_ref(&cx, TOAST_MANAGER),
            maximum: 6,
        }
        // dioxus router info
        Router {
            Route {
                to: "/",
                HelloDioxus {}
            }
            Route {
                to: "/hi/:name",
                SayHi {}
            }
            Route {
                to: "/about",
                About {}
            }
            // 404 page
            Route { to: "", pages::_404::NotFound {} }
        }
    })
}
