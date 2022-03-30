const apiURL = 'http://localhost:8080/api';

let loggedUser = JSON.parse(localStorage.getItem('loggedUser'));

fetch(apiURL + `/posts/friends/${1}`)
    .then(res => {
        if(res.status !== 200) alert(res.data);

        return res.json();
    })
    .then(data => {
        console.log(data);
    })
    .catch(err => {
        console.log(err);
    });