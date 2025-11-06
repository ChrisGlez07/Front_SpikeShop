import '../about.css';

export default function about() {
  return (
    <>

      <div className='rowAbout'>
        <div className='colAbout'>
          <div className='textoContainer'>
        
        <h1 className='textoTitulo1'>About us</h1>
          
          <h4 className='paragraf1'>SpikeShop:is a 100% Mexican clothing store created with a passion for style, authenticity, and innovation.</h4>
         <h4 className='paragraf1'>We are inspired by urban culture and modern trends, but always with a local touch that reflects our identity and creativity.</h4>
          </div>
        </div>
        <div className='colAbout'>
          <div className='imgContainer'>
          </div>
        </div>
      </div>
      <div className='rowAbout'>
        <div className='colAbout2'>
          <div className='imgContainer2'>
          </div>
        </div>
        <div className='colAbout2'>
           <div className='textoContainer'>
          <h1 className='titulo2'>Our mission</h1>
          <h4 className='paragraf2'>We are committed to offering quality products that combine design, durability, and style.</h4>
         <h4 className='paragraf2'>We want each customer to have a unique experience when wearing our garments, promoting Mexican talent and supporting responsible consumption.</h4>
          </div>
        </div>
      </div>

    </>
  );
}