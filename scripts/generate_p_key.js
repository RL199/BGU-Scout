//open the site https://bgu4u22.bgu.ac.il/apex/10g/r/f_login1004/login_desktop?p_lang=
//and fill the form with the user_name and password and id
//then click on the login button

//open silent tab
chrome.tabs.create({
    url: 'https://bgu4u22.bgu.ac.il/apex/10g/r/f_login1004/login_desktop?p_lang=',
    active: false
}, function(tab) {
    // Tab opened silently, you can now interact with it if needed
    console.log('Tab opened silently with ID:', tab.id);

    // Optionally, you can execute a script in the newly opened tab
    chrome.tabs.executeScript(tab.id, {
        code: `
            document.getElementById('user_name').value = 'your_username';
            document.getElementById('password').value = 'your_password';
            document.getElementById('id').value = 'your_id';
            document.getElementById('login_button').click();
        `
    });
});
