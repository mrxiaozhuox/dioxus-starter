#![allow(non_snake_case)]

use dioxus::prelude::*;
use dioxus_toast::{ToastManager, ToastFrame};

mod components;
mod hooks;
mod pages;
mod mode;

use pages::starter::{HelloDioxus, SayHi, About};

static DARK_MODE: dioxus::fermi::Atom<bool> = |_| {
    let dark = mode::is_dark();
    mode::mode(dark);
    dark
};

static TOAST_MANAGER: dioxus::fermi::AtomRef<ToastManager> = |_| ToastManager::default();

fn main() {
    wasm_logger::init(wasm_logger::Config::default());
    log::info!("Powered by Dioxus Starter: https://github.com/mrxiaozhuox/dioxus-starter");
    dioxus::web::launch(App)
}

fn App(cx: Scope) -> Element {

    let toast = use_atom_ref(&cx, TOAST_MANAGER);

    cx.render(rsx! {
        ToastFrame {
            manager: toast,
            maximum: 6,
        }
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
            Route { to: "", pages::_404::NotFound {} }
        }
    })
}
