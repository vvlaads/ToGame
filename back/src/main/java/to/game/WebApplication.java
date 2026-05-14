package to.game;

import jakarta.annotation.sql.DataSourceDefinition;
import jakarta.ws.rs.ApplicationPath;
import jakarta.ws.rs.core.Application;

@ApplicationPath("/to-game-api")
@DataSourceDefinition(
    name = "java:jboss/togameDS",
    className = "org.postgresql.ds.PGSimpleDataSource",
    user = "postgres",
    password = "postgres",
    databaseName = "togame",
    serverName = "localhost",
    portNumber = 5432
)
public class WebApplication extends Application {

}