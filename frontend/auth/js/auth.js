const URL = "https://onlineteacher-com.onrender.com";;

const registration = async (event) =>
{
    event.preventDefault();
    const username = get_value("username");
    const first_name = get_value("first-name");
    const last_name = get_value("last-name");
    const email = get_value("email");
    const password = get_value("pass");
    const confirm_password = get_value("con-pass");
    const info = {
        username,
        first_name,
        last_name,
        email,
        password,
        confirm_password,
    };

    if (await is_user(username))
    {
        alert("User name already exits!");
        return;
    }

    console.log(info);

    if (password == confirm_password)
    {

        if (/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(password))
        {

            document.querySelectorAll(".save-btn").forEach(btn => btn.style.display = "none");
            document.querySelectorAll(".loading-btn").forEach(btn => btn.style.display = "block");

            const url = `${URL}/user-account/register/`;

            await fetch(url, {

                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(info)

            }).then(res => res.json())
                .then(data =>
                {
                    console.log(data);
                    if (data?.error)
                    {
                        alert(data.error);
                    }
                    else
                    {
                        // window.location.href = "https://mail.google.com/mail/u/0/#inbox";
                    }
                })
                .catch(err => console.error(err));

            document.querySelectorAll(".save-btn").forEach(btn => btn.style.display = "block");
            document.querySelectorAll(".loading-btn").forEach(btn => btn.style.display = "none");
        }
        else
        {

            document.getElementById('pass').value = "";
            document.getElementById('con-pass').value = "";
            alert("Password must contain eight characters, at least one letter, one number and one special character!");
        }
    } else
    {
        document.getElementById('pass').value = "";
        document.getElementById('con-pass').value = "";
        alert("Password and confirm password does not match!");
    }

};

const get_value = (id) =>
{
    return document.getElementById(id).value;
};

async function is_user(username)
{
    let user = null;
    const url = `${URL}/accounts/user-list/?username=${username}`;

    await fetch(url)
        .then(res => res.json())
        .then(data => user = data)
        .catch(err => console.error(err));

    return user?.length > 0;
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

const login = async (event) =>
{
    event.preventDefault();
    const username = get_value("login-name");
    const password = get_value("login-pass");

    console.log({
        username,
        password
    });

    document.querySelectorAll(".save-btn").forEach(btn => btn.style.display = "none");
    document.querySelectorAll(".loading-btn").forEach(btn => btn.style.display = "block");

    const url = `${URL}/user-account/login/`;

    await fetch(url, {

        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            username,
            password
        })

    }).then(res => res.json())
        .then(data =>
        {
            console.log(data);
            if (data.token && data.user_id)
            {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user_id", data.user_id);
                window.location.href = "../profile.html";
            }
            else
            {
                document.getElementById('login-name').value = "";
                document.getElementById('login-pass').value = "";
                alert("Password and name does not match to any valid user!");
            }
        })
        .catch(err => console.error(err));

    document.querySelectorAll(".save-btn").forEach(btn => btn.style.display = "block");
    document.querySelectorAll(".loading-btn").forEach(btn => btn.style.display = "none");
};


const load_page = () =>
{
    if (localStorage.getItem("token") && localStorage.getItem("user_id"))
    {
        window.location.href = "../index.html";
    }
};

load_page();