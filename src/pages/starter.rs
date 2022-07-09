use dioxus::prelude::*;
use dioxus_toast::ToastInfo;

use crate::{
    components::{content::{Href, Markdown}, footer::Footer},
    TOAST_MANAGER,
};

pub fn HelloDioxus(cx: Scope) -> Element {
    let window = web_sys::window().unwrap();
    let input_name = use_state(&cx, String::new);
    let toast = use_atom_ref(&cx, TOAST_MANAGER);
    cx.render(rsx! {
        section {
            class: "h-screen bg-cover bg-white dark:bg-gray-600",
            div {
                class: "flex h-full w-full items-center justify-center container mx-auto px-8",
                div {
                    class: "max-w-2xl text-center",
                    h1 {
                        class: "text-3xl sm:text-5xl capitalize tracking-widest text-gray-600 dark:text-white lg:text-6xl",
                        "Dioxus Starter"
                    }
                    p {
                        class: "mt-6 lg:text-lg text-gray-600 dark:text-white",
                        "Opinionated Dioxus Starter Template"
                    }
                    div {
                        class: "mt-8 flex flex-col space-y-3 sm:-mx-2 sm:flex-row sm:justify-center sm:space-y-0",
                        input {
                            r#type: "text",
                            class: "rounded-md border border-transparent bg-gray-800 dark:bg-white/20 px-4 py-2 text-white placeholder-white backdrop-blur-sm focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 sm:mx-2",
                            placeholder: "What's your name ?",
                            oninput: move |e| input_name.set(e.value.clone()),
                            value: "{input_name}"
                        }
                        button {
                            class: "transform rounded-md bg-blue-700 px-8 py-2 text-sm font-medium capitalize tracking-wide text-white transition-colors duration-200 hover:bg-blue-600 focus:bg-blue-600 focus:outline-none sm:mx-2",
                            onclick: move |_| {
                                let name = input_name.get();
                                if !name.is_empty() {
                                    let _ = window.location().set_href(&format!("/hi/{}", name));
                                } else {
                                    toast.write().popup(ToastInfo::warning("Empty input box", "Dioxus Toast"));
                                }
                            },
                            "Go"
                        }
                    }
                    Footer {}
                }
            }
        }
    })
}

pub fn SayHi(cx: Scope) -> Element {
    let route = use_route(&cx);
    let name = route.segment("name").unwrap();
    let name = urlencoding::decode(name).expect("UTF-8").to_string();
    cx.render(rsx! {
        section {
            class: "h-screen bg-cover bg-white dark:bg-gray-600",
            div {
                class: "flex h-full w-full items-center justify-center container mx-auto px-8",
                div {
                    class: "max-w-2xl text-center",
                    h1 {
                        class: "text-3xl sm:text-5xl capitalize tracking-widest dark:text-white lg:text-6xl",
                        "Hi, \"{name}\""
                    }
                    Footer {}
                }
            }
        }
    })
}

pub fn About(cx: Scope) -> Element {
    cx.render(rsx! {
        section {
            class: "h-screen bg-cover bg-white dark:bg-gray-600",
            div {
                class: "flex h-full w-full items-center justify-center container mx-auto px-8",
                div {
                    class: "max-w-2xl text-center",
                    h1 {
                        class: "text-3xl capitalize tracking-widest dark:text-white",
                        "About Dioxus Starter"
                    }
                    div {
                        class: "text-gray-800 dark:text-white mt-6",
                        Href {
                            to: "/",
                            "Dioxus Starter"
                        }
                        " is a "
                        Href {
                            to: "https://dioxuslabs.com/",
                            "Dioxus Web"
                        }
                        " template made by "
                        Href {
                            to: "http://github.com/mrxiaozhuox",
                            "@mrxiaozhuox"
                        }
                        " for quick app development"
                    }
                    Footer {}
                }
            }
        }
    })
}

pub fn MarkdownDisplay(cx: Scope) -> Element {
    cx.render(rsx! {
        div {
            class: "pt-6 container mx-auto",
            Markdown {
                content: "# Hello World".to_string()
            }
        }
    })
}