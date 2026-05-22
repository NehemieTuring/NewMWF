
import java.sql.*;

public class CheckRefueling {
    public static void main(String[] args) {
        try {
            Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/mutuelle_db", "root", "");
            Statement stmt = conn.createStatement();

            System.out.println("--- Exercises ---");
            ResultSet rs = stmt.executeQuery("SELECT id, year, active FROM exercise");
            while (rs.next()) {
                System.out.println("ID: " + rs.getLong("id") + ", Year: " + rs.getString("year") + ", Active: "
                        + rs.getBoolean("active"));
            }

            System.out.println("\n--- Refuelings ---");
            rs = stmt.executeQuery("SELECT id, exercise_id, status FROM refueling");
            while (rs.next()) {
                System.out.println("ID: " + rs.getLong("id") + ", Exercise ID: " + rs.getLong("exercise_id")
                        + ", Status: " + rs.getString("status"));
            }

            conn.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
