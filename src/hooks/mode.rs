use dioxus::signals::{Readable, Signal};
use dioxus_sdk::storage::{use_synced_storage, LocalStorage};

pub fn use_mode() -> Signal<bool> {
    use_synced_storage::<LocalStorage, bool>("mode".to_string(), || false)
}

pub fn mode(dark: bool) {
    if dark {
        let _ = js_sys::eval("document.documentElement.classList.add('dark');");
    } else {
        let _ = js_sys::eval("document.documentElement.classList.remove('dark');");
    }
}

pub fn init_mode_info() {
    let _ = js_sys::eval("document.body.classList.add('dark:bg-gray-600');");
    let dark = use_mode();
    if *dark.read() {
        let _ = js_sys::eval("document.documentElement.classList.add('dark');");
    } else {
        let _ = js_sys::eval("document.documentElement.classList.remove('dark');");
    }
}
