// use dioxus::prelude::use_hook;
// use pulldown_cmark::{Options, Parser, html};
//
// pub fn use_markdown() -> UseMarkdown<'_, '_> {
//     let options = Options::all();
//     use_hook(|| {
//         let parser = Parser::new_ext(str, options);
//         UseMarkdown { parser }
//     })
// }
//
// pub struct UseMarkdown<'a, 'b> {
//     parser: Parser<'a, 'b>
// }
//
// impl<'a, 'b> UseMarkdown<'a, 'b> {
//     pub fn to_html(&mut self) -> String {
//         let mut output = String::new();
//         html::push_html(&mut output, &mut self.parser);
//         output
//     }
// }
