from django.db import models

def document_filename(instance, filename):
    return '/'.join(['document-fonts', filename])
    
class DocumentFont(models.Model):
    title = models.CharField(max_length=128,help_text='The human readable title.')
    font_file = models.FileField(upload_to=document_filename,help_text='The font file.')
    fontface_definition = models.TextField(help_text='The CSS definition of the font face (everything inside of @font-face{}). Add [URL] where the link to the font file is to appear.')

    def __unicode__(self):
        return self.title

class DocumentStyle(models.Model):
    title = models.CharField(max_length=128,help_text='The human readable title.')
    filename = models.SlugField(max_length=20,help_text='The base of the filenames the style occupies.')
    contents = models.TextField(help_text='The CSS style definiton.')
    fonts = models.ManyToManyField(DocumentFont, blank=True, null=True, default=None)
    
    def __unicode__(self):
        return self.title