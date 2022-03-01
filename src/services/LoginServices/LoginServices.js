import axios from "axios";
import { Store } from "../../store/index";

class LoginServices {
  async login(email, password) {
    const url = Store.getters["routes/getRoute"]("login");
    let resp = await axios.post(url, {
      email,
      password
    });

    return resp;
  }
}

export { LoginServices };
