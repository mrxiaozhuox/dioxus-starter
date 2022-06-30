use dioxus::core::ScopeState;
use pulldown_cmark::{Options, Parser, html};

pub fn use_markdown(cx: &ScopeState) -> &dyn Fn(String) -> String {
    let options = Options::all();
    cx.use_hook(|_| {
        move |content: String| {
            let str = &content;
            let parser = Parser::new_ext(str, options);

            let mut output = String::new();
            html::push_html(&mut output, parser);

            output
        }
    })
}
