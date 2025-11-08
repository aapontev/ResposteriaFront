import { Producto } from "./producto.model";
import { RecetaIngredientes } from "./recetaIngredientes.model";
import { RecetaPasos } from "./recetaPasos.model";

export interface Receta{
idReceta: number;
nombre: string;
descripcion: string;
tiempoPrep: number;
producto: Producto;
pasos: RecetaPasos[];
ingredientes: RecetaIngredientes[];
}