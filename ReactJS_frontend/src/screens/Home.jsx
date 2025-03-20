import React from 'react';
import brand from './../assets/brand.png';

const LandingPage = () => {
  return (
    <div id='home'>
      <header>
        <h1>Welcome to <span className='gradient-text' style={{ cursor: `url(${brand}), auto` }}>PixelVault</span></h1>
        <h2>Your Virtual Art Gallery for Creators, Photographers, and Designers</h2>
        <p>Discover, showcase, and share your artwork in a vibrant online gallery for artists and photographers worldwide.</p>
        <h3 className='gradient-text-a cursor-pointer w-fc p-ms' onClick={() => window.location = '/explore'}>Explore the Gallery</h3>
        <p>Whether you're an artist, photographer, graphic designer, or simply an art enthusiast, PixelVault is your creative hub to showcase and admire beautiful artwork.</p>
        <hr></hr>
        <p><span className='gradient-text-b cursor-pointer' onClick={() => window.location = '/auth'}>Sign up now</span> and start sharing your images, albums, and creative projects.</p>
      </header>

      <section>
        <h2>Why Choose PixelVault for Your Artwork?</h2>
        <ul>
          <li><strong>Creative Freedom:</strong> Showcase your photography, digital art, or graphic design work to a global audience. Control the visibility of your images with public and private settings.</li>
          <li><strong>Community Connection:</strong> Join a network of like-minded artists, photographers, and creators. Exchange feedback, build relationships, and engage with a supportive creative community.</li>
          <li><strong>Simple to Use:</strong> Easily upload and manage your image galleries, albums, and artwork on PixelVault’s intuitive platform. Share your passion with minimal effort!</li>
          <li><strong>Build Your Artistic Profile:</strong> Curate your virtual portfolio with your most admired creations. Track engagement on your artwork and connect with art lovers who appreciate your style.</li>
          <li><strong>Download & Save:</strong> Keep your favorite works of art at your fingertips. Download images from other creators and collect inspiration for your next project.</li>
        </ul>
        <button className='btn-primary' onClick={() => window.location = '/explore'}>
          Explore the Image Gallery
        </button>
      </section>

      <section>
        <h2>How PixelVault Works:</h2>
        <ol>
          <li>
            <strong>Create Your Profile:</strong> Sign up and start showcasing your artwork, photography, or designs. Customize your profile to reflect your personal style and creative journey.
          </li>
          <li>
            <strong>Share Your Artwork:</strong> Upload high-quality images to showcase your work in your online gallery. Whether it's photography, digital illustrations, or graphic design, your creations will shine!
            <ul>
              <li><strong>Public Artwork:</strong> Display your images for everyone to explore in the global gallery.</li>
              <li><strong>Private Artwork:</strong> Keep certain pieces private, visible only to you or selected followers.</li>
            </ul>
          </li>
          <li>
            <strong>Discover New Art:</strong> Browse through thousands of public images and albums from talented creators. Get inspired by innovative photography, breathtaking artwork, and unique designs from around the world.
          </li>
          <li>
            <strong>Engage with Art:</strong> Show appreciation by liking and commenting on images that resonate with you. Increase your visibility by interacting with others and gaining more likes on your creations.
          </li>
          <li>
            <strong>Download & Save Your Favorite Images:</strong> You can save stunning artwork from others to your personal collection for later inspiration or download them directly to your device.
          </li>
        </ol>
      </section>

      <footer>
        <p>PixelVault – A Virtual Art Gallery for Creators</p>
      </footer>
    </div>
  );
};

export default LandingPage;
