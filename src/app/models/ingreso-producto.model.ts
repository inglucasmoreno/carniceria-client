export class IngresoProducto {
    constructor(
        public id: string,
        public ingreso: string,
        public producto: string,
        public cantidad: number,
        public usuario_creacion: string,   
        public activo: boolean,
        public createdAt: Date   
    ){}
}