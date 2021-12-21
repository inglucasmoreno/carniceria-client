export class Producto {
    constructor(
        public _id: string,
        public codigo: string,
        public tipo: string,
        public descripcion: string,
        public precio_costo: number,
        public unidad_medida: any,
        public stock_minimo: boolean,
        public cantidad_minima: number,
        public precio: number,
        public porcentaje_ganancia: number,
        public promocion: boolean,
        public precio_promocion: number,
        public activo: boolean,
        public cantidad?: number   
    ){}   
}