fetch('https://shrouded-plains-80012.herokuapp.com/api/v1/auth/login', {
    method: 'POST',
    headers: {
        "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
    },
    body: {
        username: 'elikeyz',
        password: 'mastahacka'
    }
}).then(response => response.json()).then(data => {console.log(data)}).catch(err => console.log(err));

fetch(`https://api.unsplash.com/search/photos?page=1&query=cats`, {
            headers: {
                Authorization: 'Client-ID 56e0b8326eac6c03b3f492dad48e3c2b0d39721c97565ae17e5f809da45f5428'
            }
        }).then(response => response.json()).then(data => {console.log(data)}).catch(err => console.log(err));
