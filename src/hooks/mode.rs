use dioxus::core::ScopeState;
use dioxus_local_storage::use_local_storage;

pub fn is_dark(cx: &ScopeState) -> bool {
    let storage = use_local_storage(cx);

    let current_mode = storage.get("mode");
    if current_mode.is_none() {
        false
    } else {
        current_mode.unwrap().to_lowercase() == "dark"
    }
}

pub fn mode(cx: &ScopeState, dark: bool) {
    let storage = use_local_storage(cx);
    let state = storage.insert("mode", if dark { "dark" } else { "light" });
    if dark && state {
        let _ = js_sys::eval("document.documentElement.classList.add('dark');");
    } else {
        let _ = js_sys::eval("document.documentElement.classList.remove('dark');");
    }
}

pub fn init_mode_info(cx: &ScopeState) {
    let _ = js_sys::eval("document.body.classList.add('dark:bg-gray-600');");

    let storage = use_local_storage(cx);
    cx.use_hook(move || {
        let dark = storage.get("mode").unwrap_or("light".to_string()) == "dark";
        if dark {
            let _ = js_sys::eval("document.documentElement.classList.add('dark');");
        } else {
            let _ = js_sys::eval("document.documentElement.classList.remove('dark');");
        }
    });
}
