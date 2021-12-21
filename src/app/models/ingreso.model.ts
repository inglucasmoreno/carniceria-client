export class Ingreso {
    constructor(
        public codigo: number,
        public proveedor: { razon_social: string, },
        public fecha_cierre: Date,
        public usuario_creacion: string,
        public usuario_cierre: string,
        public createdAt: Date,        
        public activo: boolean
    ){}    
}