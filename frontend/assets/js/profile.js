const URL = "http://127.0.0.1:8000";

const is_logged = () =>
{
    return localStorage.getItem("token") && localStorage.getItem("user_id");
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

const load_profile_page = async () =>
{
    if (!is_logged())
    {
        window.location.href = "./auth/login.html";
    }
    set_nav_btn();

    const user_id = localStorage.getItem("user_id");

    if ((await is_admin(user_id)))
    {
        window.location.href = "admin_panel.html";
    }
    else if ((await get_teacher_data(user_id)))
    {
        window.location.href = "profile_teacher.html";
    }
    else if ((await get_student_data(user_id)))
    {
        window.location.href = "profile_student.html";
    }
    else
    {
        document.getElementById("select-account-section").style.display = "block";
    }
};


const get_teacher_data = async (user_id) =>
{
    let teacher = null;

    const url = `${URL}/accounts/teacher-list/?user__id=${user_id}`;
    await fetch(url)
        .then(res => res.json())
        .then(data => teacher = data)
        .catch(err => console.error(err));

    console.log("🚀 ~ teacher:", teacher);
    return teacher?.length;
};



const is_admin = async (user_id) =>
{
    let is_superuser = false;

    const url = `${URL}/accounts/user-list/?id=${user_id}`;

    await fetch(url)
        .then(res => res.json())
        .then(data => is_superuser = data[0].is_superuser)
        .catch(err => console.error(err));

    console.log("🚀 ~ is_superuser:", is_superuser);

    return is_superuser;
};




const get_student_data = async (user_id) =>
{
    let student = null;

    const url = `${URL}/accounts/student-list/?user__id=${user_id}`;
    await fetch(url)
        .then(res => res.json())
        .then(data => student = data)
        .catch(err => console.error(err));

    console.log("🚀 ~ student:", student);
    return student?.length;
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

load_profile_page();