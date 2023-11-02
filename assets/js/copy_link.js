$("a.link").click( async function(e) {
    e.preventDefault();

    if ($(this).text() === 'Copied 👍') {
        return;
    }

    let link = e.target.innerText;
    link = link.replace('🔥 ', '')
    link = link.replace(' 🔥', '')

    navigator.clipboard.writeText('https://' + link);
    $(this).text('Copied 👍');

    setTimeout(() => {
        $(this).text('🔥 ' + link + ' 🔥');
    }, 2000);
})
