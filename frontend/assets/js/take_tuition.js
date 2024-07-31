const URL = "http://127.0.0.1:8000";


function is_logged()
{
    return localStorage.getItem("token") && localStorage.getItem("user_id");
}

const load_tuition_page = () =>
{

    if (!is_logged)
    {
        window.location.href = "index.html";
    }
    set_nav_btn();

    load_data();
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

const create_tuition = async (event) =>
{
    event.preventDefault();

    const type = get_value('type');
    const starting_hour = get_value('start-time');
    const ending_hour = get_value('end-time');
    const total_hours = get_value('total-hours');
    const description = get_value('description');

    let selected = document.querySelectorAll('#subjects option:checked');
    const subjects = Array.from(selected).map(sub => sub.value);

    selected = document.querySelectorAll("#week_days_option option:checked");
    const week_days_option = Array.from(selected).map(day => day.value);

    const id = await get_account_id(new URLSearchParams(window.location.search).get("user_id"),
        localStorage.getItem('user_id')
    );

    const info = {
        type,
        week_days_option,
        starting_hour,
        ending_hour,
        total_hours,
        description,
        subjects,
        student: id.student,
        teacher: id.teacher,
    };

    console.log(info);

    const token = localStorage.getItem("token");
    url = `${URL}/tuition/tuition-list/`;

    await fetch(url, {
        method: "POST",
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

const get_account_id = async (teacher_user_id, student_user_id) =>
{
    console.log({ teacher_user_id, student_user_id });

    let teacher, student = null;

    let url = `${URL}/accounts/teacher-list/?user__id=${teacher_user_id}`;

    await fetch(url)
        .then(res => res.json())
        .then(data => teacher = data[0].id)
        .catch(err => console.error(err));

    url = `${URL}/accounts/student-list/?user__id=${student_user_id}`;

    await fetch(url)
        .then(res => res.json())
        .then(data => student = data[0].id)
        .catch(err => console.error(err));

    return { teacher, student };
};

const get_value = (id) =>
{
    return document.getElementById(id).value;
};


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

load_tuition_page()

