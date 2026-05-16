const btnLogin = document.getElementById("btn-login");

btnLogin.addEventListener("click", () => {

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    const erro = document.getElementById("erro-login");

    if(email === "admin@iasd.com" && senha === "123456"){

        localStorage.setItem("adminLogado", "true");

        window.location.href = "painel.html";

    }else{

        erro.innerText = "Email ou senha inválidos";

    }

});