const two_line = /\n\n/g;
const one_line = /\n/g;
let first_char = /\S/;

export const showInfo = (s) => {
    if (s) {
        for (let child = info.firstChild; child; child = child.nextSibling) {
            if (child.style) {
                if (child.id == s) {
                    child.classList.add('show')
                } else {
                    child.classList.remove('show')
                }
            }
        }
    } else {
        info.classList.remove('show');
    }
}

export const linebreak = (s) =>  s.replace(two_line, '<p></p>').replace(one_line, '<br>');
export const capitalize = (s) => s.replace(first_char, function(m) { return m.toUpperCase(); });

export default {
    showInfo, linebreak, capitalize
};
