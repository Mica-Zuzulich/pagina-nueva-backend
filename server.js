import express from "express";
import cors from "cors";
import contactoRoutes from "./routes/contacto.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", contactoRoutes);

app.listen(process.env.PORT || 5000, () =>
  console.log(`Servidor corriendo en puerto ${process.env.PORT || 5000} 🚀`)
);
