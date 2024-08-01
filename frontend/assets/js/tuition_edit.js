const URL = "https://onlineteacher-com.onrender.com";
// const URL = "http://127.0.0.1:8000"

const is_logged = () =>
{
    return localStorage.getItem("token") && localStorage.getItem("user_id");
};

const load_page = async () =>
{
    document.title = "edit_tuition";

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
    await load_page_data();

    const tuition_id = new URLSearchParams(window.location.search).get("id");
    if (tuition_id) await set_tuition_data(tuition_id);
};


const set_tuition_data = async (tuition_id) =>
{
    const url = `${URL}/tuition/tuition-list/?id=${tuition_id}`;

    await fetch(url)
        .then(res => res.json())
        .then(tuition =>
        {
            tuition = tuition[0];
            console.log("🚀 ~ tuition:", tuition);

            tuition.subjects.forEach(sub =>
            {
                document.querySelector(`#subjects option[value="${sub.id}"]`).selected = true;
            });

            tuition.week_days_option.forEach(day =>
            {
                document.querySelector(`#week_days_option option[value="${day.id}"]`).selected = true;
            });

            document.getElementById("starting_hour").value = tuition.starting_hour;
            document.getElementById("ending_hour").value = tuition.ending_hour;
            document.getElementById("total_hours").value = tuition.total_hours.slice(0, 5);
            document.getElementById("description").value = tuition.description;
            document.getElementById("status").value = tuition.status;
            document.getElementById("type").value = tuition.type;
            document.getElementById("student-account").value = tuition.student.id;
            document.getElementById("teacher-account").value = tuition.teacher.id;


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
    const status = get_value('status');
    const student = get_value('student-account');
    const teacher = get_value('teacher-account');

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
        status,
        teacher,
        student,
        user_id: localStorage.getItem("user_id")
    };

    document.querySelectorAll(".save-btn").forEach(btn => btn.style.display = "none");
    document.querySelectorAll(".loading-btn").forEach(btn => btn.style.display = "block");

    const id = new URLSearchParams(window.location.search).get("id");
    const token = localStorage.getItem('token');
    let url = `${URL}/tuition/tuition-list/`;
    let method = "POST";

    if (id)
    {
        url = `${URL}/tuition/update/${id}`;
        method = "PUT";
    }



    await fetch(url, {
        method: method,
        headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(info)

    }).then(res => res.json())
        .then(data => console.log(data))
        .catch(err => console.error(err));

    window.location.href = "admin_panel.html";
};


const load_page_data = async () =>
{
    // subjects
    let url = `${URL}/accounts/subject-list/`;

    await fetch(url)
        .then(res => res.json())
        .then(data =>
        {
            console.log(data);

            data.forEach(sub =>
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

    await fetch(url)
        .then(res => res.json())
        .then(data =>
        {
            console.log(data);

            data.forEach(day =>
            {
                const parent = document.getElementById('week_days_option');
                parent.insertAdjacentHTML('beforeend', `
                
                    <option value="${day.id}">${day.name}</option>
                `);

            });
        })
        .catch(err => console.error(err));


    // student account list
    url = `${URL}/accounts/student-list/`;

    await fetch(url)
        .then(res => res.json())
        .then(data =>
        {
            data.forEach(student =>
            {
                const parent = document.getElementById('student-account');
                parent.insertAdjacentHTML('beforeend', `

                    <option value="${student.id}">${student.user.username}</option>
                `);

            });
        })
        .catch(err => console.error(err));

    // teacher account list
    url = `${URL}/accounts/teacher-list/`;

    await fetch(url)
        .then(res => res.json())
        .then(data =>
        {
            data.forEach(teacher =>
            {
                const parent = document.getElementById('teacher-account');
                parent.insertAdjacentHTML('beforeend', `

                    <option value="${teacher.id}">${teacher.user.username}</option>
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


load_page();