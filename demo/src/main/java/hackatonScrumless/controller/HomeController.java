package hackatonScrumless.controller;

import hackatonScrumless.Ciudadano;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class HomeController {

	public HomeController() {
		System.out.println(">>> HomeController CARGADO");
	}

	@GetMapping("/")
	public String home() {
		return "index";
	}
	@GetMapping("/admin-login")
	public String adminLogin() {
		return "admin-login"; // carga admin-login.html
	}


	@PostMapping("/loginCiudadano")
	public String login(@RequestParam String nik,
						   @RequestParam String contrasena,
						   Model model) {
		boolean existeUsuario = false;

		System.out.println("Usuario: " + nik);
		System.out.println("Contraseña: " + contrasena);

		if (nik.equals("user") && contrasena.equals("user123")) {
			return "loggedUser";
		}

		return "index";
	}


	@PostMapping("/loginAdmin")
	public String loginAdmin(@RequestParam String nik,
						 @RequestParam String contrasena,
						 Model model) {
		boolean existeAdmin = false;

		System.out.println("UsuarioAdmin: " + nik);
		System.out.println("Contraseña: " + contrasena);

		if (nik.equals("admin") && contrasena.equals("admin123")) {
			return "loggedAdmin";
		}else{
			return "admin-login";
		}

	}
}

