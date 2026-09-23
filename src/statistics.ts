import katex from 'katex'
import 'katex/dist/katex.min.css'

// Formulas are written as plain text in the page (so they still read correctly
// without JavaScript) and upgraded to typeset maths here.
document.querySelectorAll<HTMLElement>('.tex[data-tex]').forEach((el) => {
  katex.render(el.dataset.tex ?? '', el, {
    displayMode: el.hasAttribute('data-display'),
    throwOnError: false,
  })
})
