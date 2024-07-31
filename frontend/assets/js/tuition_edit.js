const URL = "http://127.0.0.1:8000";

const is_logged = () =>
{
    return localStorage.getItem("token") && localStorage.getItem("user_id");
};

const load_edit_tuition_page = async () =>
{
    document.title = "Admin Panel";

    let is_admin = false;
    const user_id = localStorage.getItem("user_id");
    const url = `${URL}/accounts/user-list/?id=${user_id}`;

    await fetch(url)
        .then(res => res.json())
        .then(data => is_admin = data[0].is_superuser)
        .catch(err => console.error(err));


    if (!(is_logged && is_admin))
    {
        window.location.href = "index.html";
    }

    set_nav_btn();
    load_data();
    set_tuition_data();
};

const set_tuition_data = () =>
{
    const tuition_id = new URLSearchParams(window.location.search).get("id");

    const url = `${URL}/tuition/tuition-list/?id=${tuition_id}`;

    fetch(url)
        .then(res => res.json())
        .then(tuition =>
        {
            tuition = tuition[0];
            console.log("🚀 ~ tuition:", tuition);

            document.querySelector("#type").value = tuition.type;

            tuition.subjects.forEach(sub =>
            {
                document.querySelector(`#subjects option[value="${sub.id}"]`).selected = true;
            });

            tuition.week_days_option.map(day =>
            {
                document.querySelector(`#week_days_option option[value="${day.id}"]`).selected = true;
            });

            document.getElementById("starting_hour").value = tuition.starting_hour;
            document.getElementById("ending_hour").value = tuition.ending_hour;
            document.getElementById("total_hours").value = tuition.total_hours.slice(0, 5);
            document.getElementById("description").value = tuition.description;
        })
        .catch(err => console.error(err));
};

const get_value = (id) =>
{
    return document.getElementById(id).value;
};


const update_tuition = async (event) =>
{
    event.preventDefault();

    const type = get_value('type');
    const starting_hour = get_value('starting_hour');
    const ending_hour = get_value('ending_hour');
    const total_hours = get_value('total_hours');
    const description = get_value('description');

    let selected = document.querySelectorAll('#subjects option:checked');
    const subjects = Array.from(selected).map(sub => sub.value);

    selected = document.querySelectorAll("#week_days_option option:checked");
    const week_days_option = Array.from(selected).map(day => day.value);

    const info = {
        type,
        week_days_option,
        starting_hour,
        ending_hour,
        total_hours,
        description,
        subjects,
        user_id: localStorage.getItem("user_id")
    };

    const id = new URLSearchParams(window.location.search).get("id");
    const url = `${URL}/tuition/update/${id}`;
    const token = localStorage.getItem('token');

    await fetch(url, {
        method: "PATCH",
        headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(info)

    }).then(res => res.json())
        .then(data => console.log(data))
        .catch(err => console.error(err));

    window.location.href = "profile.html";
};


const load_data = () =>
{
    let url = `${URL}/accounts/subject-list/`;

    fetch(url)
        .then(res => res.json())
        .then(data =>
        {
            console.log(data);

            data.map(sub =>
            {

                const parent = document.getElementById('subjects');
                parent.insertAdjacentHTML('beforeend', `
                
                    <option value="${sub.id}">${sub.name}</option>
                `);

            });
        })
        .catch(err => console.error(err));

    // Available days
    url = `${URL}/accounts/day-list/`;

    fetch(url)
        .then(res => res.json())
        .then(data =>
        {
            console.log(data);

            data.map(day =>
            {

                const parent = document.getElementById('week_days_option');
                parent.insertAdjacentHTML('beforeend', `
                
                    <option value="${day.id}">${day.name}</option>
                `);

            });
        })
        .catch(err => console.error(err));
};


function set_nav_btn()
{
    if (is_logged())
    {
        document.querySelectorAll(".logged").forEach((element) =>
        {
            element.style.display = "block";
        });

        document.querySelectorAll(".not-logged").forEach((element) =>
        {
            element.style.display = "none";
        });
    }
    else
    {
        document.querySelectorAll(".logged").forEach((element) =>
        {
            element.style.display = "none";
        });

        document.querySelectorAll(".not-logged").forEach((element) =>
        {
            element.style.display = "block";
        });
    }
}

function logout(event)
{
    event.preventDefault();

    const token = localStorage.getItem("token");
    const url = `${URL}/user-account/logout/`;

    fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Token ${token}`,

            "Content-Type": "application/json",
        }
    }).then(res => res.json())
        .then(data =>
        {
            console.log(data);

            localStorage.removeItem("token");
            localStorage.removeItem("user_id");

            window.location.href = "./auth/login.html";
        })
        .catch(err => console.error(err));
}


load_edit_tuition_page();