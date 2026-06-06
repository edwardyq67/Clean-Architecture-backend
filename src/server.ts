import app from './app';
import { initializeDatabase } from './config/database';
import { env } from './config/env';

const PORT = env.PORT || 8080;

const main = async () => {
    try {
        // Inicializar base de datos usando tu configuración
        await initializeDatabase();
        console.log("✅ DB connected");
        
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📝 Environment: ${env.NODE_ENV}`);
        });
    } catch (error) {
        console.log("❌ Error:", error);
        process.exit(1);
    }
}

main();