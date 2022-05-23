import { Tabs} from 'antd';
import { AbonosList } from './AbonosList';
import { AccionesObra } from './AccionesObra';
import { DescripcionObra } from './DescripcionObra';
import { EmpleadosRegistrados } from './EmpleadosRegistrados';
import { FacturasList } from './FacturasList';
import ImagenesObra from './ImagenesObra';
import { MaterialUtilizadoList } from './MaterialUtilizadoList';
import { ObservacionesObra } from './ObservacionesObra';

export const InfoDesarollo = ({obraInfo}) => {
  const { TabPane } = Tabs;

  return (
      <Tabs type="card">

        <TabPane tab="Info general" key="1">
          <DescripcionObra obraInfo={obraInfo}/>
        </TabPane>

        <TabPane tab="Empleados registrados" key="2">
          <EmpleadosRegistrados obraInfo={obraInfo}/>
        </TabPane>

        <TabPane tab="Trabajos realizados" key="3">
          <AccionesObra obraInfo={obraInfo}/>
        </TabPane>

        <TabPane tab="Observaciones" key="4">
          <ObservacionesObra obraInfo={obraInfo}/>
        </TabPane>

        <TabPane tab="Material utilizado" key="5">
          <MaterialUtilizadoList obraInfo={obraInfo}/>
        </TabPane>

        <TabPane tab="Facturas" key="6">
          <FacturasList obraInfo={obraInfo}/>
        </TabPane>

        <TabPane tab="Abonos" key="7">
          <AbonosList obraInfo={obraInfo}/>
        </TabPane>

        <TabPane tab="Imagenes" key="8">
          <ImagenesObra obraInfo={obraInfo}/>
        </TabPane>
    </Tabs>
  )
}