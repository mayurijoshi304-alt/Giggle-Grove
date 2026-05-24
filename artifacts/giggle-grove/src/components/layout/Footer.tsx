export function Footer() {
  return (
    <footer className="bg-white border-t border-primary/10 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="font-serif text-2xl font-bold gradient-text mb-4">Giggle Grove</h3>
            <p className="text-muted-foreground text-sm">
              Magical, personalized storytelling and colouring books for your little ones.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/" className="hover:text-primary">Home</a></li>
              <li><a href="/services" className="hover:text-primary">Services</a></li>
              <li><a href="/samples" className="hover:text-primary">Sample Stories</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Programs</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/influencer" className="hover:text-primary">Influencer Program</a></li>
              <li><a href="/pricing" className="hover:text-primary">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="mailto:mayurijoshi304@gmail.com" className="hover:text-primary">Email Us</a></li>
              <li><a href="https://www.instagram.com/giggle.grove_00" target="_blank" rel="noreferrer" className="hover:text-primary">Instagram</a></li>
              <li><a href="https://whatsapp.com/channel/0029VbCtIzuGufIpwZOR6Y00" target="_blank" rel="noreferrer" className="hover:text-primary">WhatsApp</a></li>
            </ul>
          </div>
        </div>
        <div className="text-center text-sm text-muted-foreground pt-8 border-t border-primary/10">
          <p>&copy; {new Date().getFullYear()} Giggle Grove. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
