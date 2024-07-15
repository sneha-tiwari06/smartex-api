export const generateSlug = (title) => {
    const slug = title.toString().toLowerCase()
      .replace(/\s+/g, '-')           
      .replace(/[^\w\-]+/g, '')     
      .replace(/\-\-+/g, '-')         
      .replace(/^-+/, '')            
      .replace(/-+$/, '');         
  
    return slug;
  };