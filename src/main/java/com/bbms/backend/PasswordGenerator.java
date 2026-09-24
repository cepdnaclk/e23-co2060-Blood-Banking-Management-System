import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordGenerator {

    public static void main(String[] args) {

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        String password = "Hospital@123";

        String hash = encoder.encode(password);

        System.out.println("PASSWORD: " + password);
        System.out.println("HASH: " + hash);

        boolean matches = encoder.matches(password, hash);

        System.out.println("MATCH: " + matches);
    }
}