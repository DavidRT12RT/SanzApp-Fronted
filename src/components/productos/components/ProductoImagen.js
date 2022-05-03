import { Divider, Image } from 'antd';

function ImageDemo() {
  return (
    <>
    <Divider orientation="left">Imagen del producto</Divider>
    <Image
      width={300}
      src="https://www.comex.com.mx/getattachment/9e00da91-5d36-49de-a30c-53fea61922f6/.aspx/"
      className='d-block'
    />
    </>
  );
}

export const ProductoImagen = () => (<ImageDemo />);
