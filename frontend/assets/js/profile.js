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

const load_profile_page = () =>
{

    if (!is_logged())
    {
        window.location.href = "index.html";
    }
    set_nav_btn();

    const user_id = localStorage.getItem("user_id");
    console.log(user_id);

    const url1 = `${URL}/accounts/teacher-list/?user__id=${user_id}`;
    const url2 = `${URL}/accounts/student-list/?user__id=${user_id}`;

    fetch(url1)
        .then(res => res.json())
        .then(data =>
        {
            if (!get_teacher_data(data))
            {
                fetch(url2)
                    .then(res => res.json())
                    .then(data => get_student_data(data))
                    .catch(err => console.error(err));
            }
        })
        .catch(err => console.error(err));
};


const get_teacher_data = (data) =>
{

    if (data?.length == 0)
    {
        return false;
    }

    window.location.href = "profile_teacher.html";
    return true;

};


const get_student_data = (data) =>
{

    if (data?.length == 0)
    {
        document.getElementById("select-account-section").style.display = "block";
    }
    else
    {

        window.location.href = "profile_student.html";
    }
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