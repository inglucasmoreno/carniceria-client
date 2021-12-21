import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../guards/auth.guard';
import { AdminGuard } from '../guards/admin.guard';

// Componentes
import { PagesComponent } from './pages.component';
import { HomeComponent } from './home/home.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { NuevoUsuarioComponent } from './usuarios/nuevo-usuario.component';
import { EditarUsuarioComponent } from './usuarios/editar/editar-usuario.component';
import { EditarPasswordComponent } from './usuarios/editar/editar-password.component';
import { UnidadMedidaComponent } from './unidad-medida/unidad-medida.component';
import { EditarUnidadComponent } from './unidad-medida/editar/editar-unidad.component';
import { ProductosComponent } from './productos/productos.component';
import { NuevoProductoComponent } from './productos/nuevo-producto.component';
import { EditarProductoComponent } from './productos/editar/editar-producto.component';
import { DetalleProductoComponent } from './productos/detalle-producto.component';
import { ProveedoresComponent } from './proveedores/proveedores.component';
import { NuevoProveedorComponent } from './proveedores/nuevo-proveedor.component';
import { EditarProveedorComponent } from './proveedores/editar/editar-proveedor.component';
import { IngresosComponent } from './ingresos/ingresos.component';
import { IngresoDetallesComponent } from './ingresos/ingreso-detalles.component';
import { VentasComponent } from './ventas/ventas.component';
import { VentasHistorialComponent } from './ventas/ventas-historial.component';
import { VentasDetallesComponent } from './ventas/ventas-detalles.component';
import { CajasComponent } from './cajas/cajas.component';
import { CajasHistorialComponent } from './cajas/cajas-historial.component';
import { PromocionesComponent } from './productos/promociones.component';
import { AlertaStockComponent } from './productos/alerta-stock.component';
import { MayoristasComponent } from './mayoristas/mayoristas.component';
import { NuevoMayoristaComponent } from './mayoristas/nuevo-mayorista.component';
import { EditarMayoristaComponent } from './mayoristas/editar/editar-mayorista.component';
import { DesechosComponent } from './desechos/desechos.component';
import { ReportesComponent } from './reportes/reportes.component';
import { ReportesVentasComponent } from './reportes/reportes-ventas.component';
import { ReportesCantidadesDesechosComponent } from './reportes/reportes-cantidades-desechos.component';
import { ReportesCajasComponent } from './reportes/reportes-cajas.component';
import { ProduccionInternaComponent } from './produccion-interna/produccion-interna.component';
import { ReportesProductosComponent } from './reportes/reportes-productos.component';
import { CuentaCorrienteComponent } from './cuenta-corriente/cuenta-corriente.component';

const routes: Routes = [
    {
        path: 'dashboard',
        component: PagesComponent,
        canActivate: [ AuthGuard ],
        children: [
            
            // Home
            { path: 'home', component: HomeComponent },
            
            // Ventas
            { path: 'ventas', component: VentasComponent },
            { path: 'ventas/historial', canActivate: [AdminGuard], component: VentasHistorialComponent },
            { path: 'ventas/detalles/:id', canActivate: [AdminGuard], component: VentasDetallesComponent },

            // Usuarios
            { path: 'usuarios', canActivate: [AdminGuard], component: UsuariosComponent },
            { path: 'usuarios/nuevo', canActivate: [AdminGuard], component: NuevoUsuarioComponent },
            { path: 'usuarios/editar/:id', canActivate: [AdminGuard], component: EditarUsuarioComponent },
            { path: 'usuarios/password/:id', canActivate: [AdminGuard], component: EditarPasswordComponent },

            // Cuenta corriente
            { path: 'cuenta_corriente/:id', canActivate: [], component: CuentaCorrienteComponent },
                        
            // Productos
            { path: 'productos', canActivate: [AdminGuard], component: ProductosComponent},
            { path: 'productos/nuevo', canActivate: [AdminGuard], component: NuevoProductoComponent},
            { path: 'productos/detalle/:id', canActivate: [AdminGuard], component: DetalleProductoComponent},
            { path: 'productos/editar/:id', canActivate: [AdminGuard], component: EditarProductoComponent},
            { path: 'productos/promociones', canActivate: [AdminGuard], component: PromocionesComponent},
            { path: 'productos/alerta-stock', canActivate: [AdminGuard], component: AlertaStockComponent},
        
            // Ingresos
            { path: 'ingresos', canActivate: [AdminGuard], component: IngresosComponent},
            { path: 'ingresos/detalles/:id', canActivate: [AdminGuard], component: IngresoDetallesComponent},

            // Unidad de medida
            { path: 'unidad_medida', canActivate: [AdminGuard], component: UnidadMedidaComponent},
            { path: 'unidad_medida/editar/:id', canActivate: [AdminGuard], component: EditarUnidadComponent},

            // Proveedores
            { path: 'proveedores', canActivate: [AdminGuard], component: ProveedoresComponent},
            { path: 'proveedores/nuevo', canActivate: [AdminGuard], component: NuevoProveedorComponent},
            { path: 'proveedores/editar/:id', canActivate: [AdminGuard], component: EditarProveedorComponent},

            // Mayoristas
            { path: 'mayoristas', canActivate: [AdminGuard], component: MayoristasComponent},
            { path: 'mayoristas/nuevo', canActivate: [AdminGuard], component: NuevoMayoristaComponent},
            { path: 'mayoristas/editar/:id', canActivate: [AdminGuard], component: EditarMayoristaComponent},
            
            // Desechos
            { path: 'desechos', component: DesechosComponent},
            
            // Produccion interna
            { path: 'produccion-interna', component: ProduccionInternaComponent},

            // Reportes
            { path: 'reportes', component: ReportesComponent},
            { path: 'reportes/ventas', component: ReportesVentasComponent},
            { path: 'reportes/productos', component: ReportesProductosComponent},
            { path: 'reportes/cantidades', component: ReportesCantidadesDesechosComponent},
            { path: 'reportes/cajas', component: ReportesCajasComponent},

            // Cajas
            { path: 'cajas', component: CajasComponent},
            { path: 'cajas/historial', canActivate: [AdminGuard], component: CajasHistorialComponent},

        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule {}