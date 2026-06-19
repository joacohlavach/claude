from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, PageBreak, KeepTogether
)
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.platypus import Flowable

GREEN_DARK  = colors.HexColor('#15803d')
GREEN_MED   = colors.HexColor('#16a34a')
GREEN_LIGHT = colors.HexColor('#dcfce7')
GREEN_PALE  = colors.HexColor('#f0fdf4')
GRAY_800    = colors.HexColor('#1f2937')
GRAY_600    = colors.HexColor('#4b5563')
GRAY_400    = colors.HexColor('#9ca3af')
GRAY_100    = colors.HexColor('#f3f4f6')
WHITE       = colors.white

W, H = A4

def build_styles():
    base = getSampleStyleSheet()

    def s(name, parent='Normal', **kw):
        p = ParagraphStyle(name, parent=base[parent], **kw)
        return p

    return {
        'cover_uni':     s('cover_uni',    fontSize=11, textColor=GRAY_600,   alignment=TA_CENTER, leading=16),
        'cover_dept':    s('cover_dept',   fontSize=10, textColor=GRAY_400,   alignment=TA_CENTER, leading=14),
        'cover_title':   s('cover_title',  fontSize=22, textColor=GREEN_DARK, alignment=TA_CENTER, leading=28, fontName='Helvetica-Bold'),
        'cover_sub':     s('cover_sub',    fontSize=13, textColor=GRAY_600,   alignment=TA_CENTER, leading=18),
        'cover_data':    s('cover_data',   fontSize=11, textColor=GRAY_800,   alignment=TA_CENTER, leading=18),
        'section_title': s('section_title',fontSize=14, textColor=WHITE,      fontName='Helvetica-Bold', leading=20),
        'sub_title':     s('sub_title',    fontSize=12, textColor=GREEN_DARK, fontName='Helvetica-Bold', leading=18, spaceBefore=14, spaceAfter=4),
        'body':          s('body',         fontSize=10, textColor=GRAY_800,   leading=16, alignment=TA_JUSTIFY, spaceAfter=6),
        'body_small':    s('body_small',   fontSize=9,  textColor=GRAY_600,   leading=14, spaceAfter=4),
        'bullet':        s('bullet',       fontSize=10, textColor=GRAY_800,   leading=15, leftIndent=14, spaceAfter=3),
        'quote':         s('quote',        fontSize=10, textColor=GREEN_DARK, leading=16, alignment=TA_JUSTIFY,
                           leftIndent=16, rightIndent=16, fontName='Helvetica-Oblique'),
        'label_green':   s('label_green',  fontSize=8,  textColor=GREEN_MED, fontName='Helvetica-Bold',
                           leading=12, spaceBefore=8),
        'footer_txt':    s('footer_txt',   fontSize=8,  textColor=GRAY_400,   alignment=TA_CENTER),
    }


class SectionHeader(Flowable):
    def __init__(self, number, title, width):
        super().__init__()
        self.number = number
        self.title  = title
        self._w     = width
        self._h     = 36

    def wrap(self, *_):
        return self._w, self._h

    def draw(self):
        c = self.canv
        c.setFillColor(GREEN_MED)
        c.roundRect(0, 0, self._w, self._h, 6, fill=1, stroke=0)
        c.setFillColor(WHITE)
        c.setFont('Helvetica-Bold', 13)
        c.drawString(14, 12, f'{self.number}  |  {self.title}')


class ColorBox(Flowable):
    def __init__(self, text, bg, text_color, width, height=28, radius=6, font_size=9):
        super().__init__()
        self.text       = text
        self.bg         = bg
        self.text_color = text_color
        self._w         = width
        self._h         = height
        self._r         = radius
        self._fs        = font_size

    def wrap(self, *_):
        return self._w, self._h

    def draw(self):
        c = self.canv
        c.setFillColor(self.bg)
        c.roundRect(0, 0, self._w, self._h, self._r, fill=1, stroke=0)
        c.setFillColor(self.text_color)
        c.setFont('Helvetica', self._fs)
        c.drawCentredString(self._w / 2, (self._h - self._fs) / 2 + 1, self.text)


def bullet(text, styles):
    return Paragraph(f'<bullet>•</bullet> {text}', styles['bullet'])


def sp(n=8):
    return Spacer(1, n)


def hr(color=GREEN_LIGHT):
    return HRFlowable(width='100%', thickness=1, color=color, spaceAfter=6, spaceBefore=6)


def page_header_footer(canvas, doc):
    canvas.saveState()
    # Header bar
    canvas.setFillColor(GREEN_PALE)
    canvas.rect(0, H - 1.1*cm, W, 1.1*cm, fill=1, stroke=0)
    canvas.setFillColor(GREEN_MED)
    canvas.setFont('Helvetica-Bold', 8)
    canvas.drawString(2*cm, H - 0.7*cm, '♻  GREENPOINT')
    canvas.setFillColor(GRAY_400)
    canvas.setFont('Helvetica', 8)
    canvas.drawRightString(W - 2*cm, H - 0.7*cm, 'Trabajo Práctico N°1 — Administración General 2026')
    # Footer
    canvas.setFillColor(GRAY_400)
    canvas.setFont('Helvetica', 7.5)
    canvas.drawCentredString(W/2, 0.7*cm, f'Página {doc.page}  ·  UTN Facultad Regional Córdoba  ·  2026')
    canvas.restoreState()


def build_pdf(path):
    doc = SimpleDocTemplate(
        path,
        pagesize=A4,
        leftMargin=2.2*cm,
        rightMargin=2.2*cm,
        topMargin=2*cm,
        bottomMargin=1.8*cm,
        title='Informe TP N°1 — Greenpoint',
        author='Grupo Greenpoint',
    )

    st = build_styles()
    usable_w = W - 4.4*cm
    story = []

    # ────────────────────────────────────────────────
    # CARÁTULA
    # ────────────────────────────────────────────────
    story += [
        sp(60),
        Paragraph('UNIVERSIDAD TECNOLÓGICA NACIONAL', st['cover_uni']),
        Paragraph('Facultad Regional Córdoba', st['cover_dept']),
        sp(4),
        HRFlowable(width='50%', thickness=1.5, color=GREEN_MED, hAlign='CENTER'),
        sp(20),
        ColorBox('Administración General  ·  2026', GREEN_LIGHT, GREEN_DARK, usable_w, 32, font_size=10),
        sp(8),
        ColorBox('Cursos 2D1, 2D2, 2D3 y 2D4', GRAY_100, GRAY_600, usable_w, 26, font_size=9),
        sp(36),
        Paragraph('Trabajo Práctico N°1', st['cover_sub']),
        sp(8),
        Paragraph('"Crear la empresa"', st['cover_title']),
        sp(48),
        ColorBox('♻  GREENPOINT', GREEN_MED, WHITE, usable_w, 52, font_size=16),
        sp(10),
        Paragraph('Plataforma de localización de puntos de reciclaje en Córdoba', st['cover_dept']),
        sp(60),
        Paragraph('Integrantes: ___________________________  ·  Curso: _______', st['cover_data']),
        sp(6),
        Paragraph('Fecha de entrega: ___________________________', st['cover_data']),
        PageBreak(),
    ]

    # ────────────────────────────────────────────────
    # INTRODUCCIÓN
    # ────────────────────────────────────────────────
    story += [
        SectionHeader('0', 'Introducción', usable_w), sp(12),
        Paragraph(
            'El presente informe corresponde al Trabajo Práctico N°1 de la materia Administración General '
            '(Ingeniería Industrial, UTN-FRC, 2026). El objetivo fue crear una organización que resuelva o '
            'atenúe un dolor o necesidad del entorno social, ambiental o comunitario.',
            st['body']
        ),
        Paragraph(
            'El grupo decidió abordar la problemática de la gestión de residuos reciclables en Córdoba '
            'capital. A partir de ese dolor identificado, se diseñó <b>Greenpoint</b>: una plataforma digital '
            'gratuita que conecta a los vecinos con el centro de acopio más cercano según su ubicación y el '
            'tipo de material que deseen reciclar.',
            st['body']
        ),
        Paragraph(
            'Las secciones que siguen desarrollan cada consigna del práctico: propósito y modelo de negocio, '
            'identidad de la organización, misión/visión/valores y estructura organizacional. Al final se '
            'incluye el link a la página web desarrollada como prototipo funcional.',
            st['body']
        ),
        sp(8), hr(),
    ]

    # ────────────────────────────────────────────────
    # 3.1 — PROPÓSITO
    # ────────────────────────────────────────────────
    story += [
        sp(14),
        SectionHeader('3.1', 'Propósito de la organización', usable_w), sp(12),

        Paragraph('El dolor identificado', st['sub_title']),
        Paragraph(
            'En Argentina, más del 50 % de los residuos que terminan en los rellenos sanitarios son '
            'potencialmente reciclables. El principal obstáculo no es la falta de voluntad de los ciudadanos, '
            'sino la falta de información accesible y actualizada sobre <i>dónde</i> llevar cada tipo de '
            'material. Los vecinos de Córdoba se enfrentan a búsquedas infructuosas, datos desactualizados '
            'en internet y ausencia de una herramienta centralizada que los oriente.',
            st['body']
        ),

        Paragraph('Propósito', st['sub_title']),
        Paragraph(
            'Reducir la brecha entre la voluntad de reciclar y la acción concreta, poniendo la información '
            'correcta al alcance de cualquier cordobés en segundos y sin costo.',
            st['body']
        ),

        Paragraph('Idea de negocio', st['sub_title']),
        Paragraph(
            'Greenpoint es una <b>plataforma web de acceso libre</b> (ONG sin fines de lucro) que, a partir '
            'de la dirección o geolocalización del usuario, muestra en un mapa los centros de acopio de '
            'residuos reciclables más cercanos, con filtros por tipo de material, horarios y datos de contacto.',
            st['body']
        ),

        Paragraph('Producto / Servicio', st['sub_title']),
        bullet('Buscador geolocalizado de puntos de reciclaje en Córdoba capital.', st),
        bullet('Filtro por tipo de residuo: plástico, vidrio, papel, metal, electrónicos, aceite, textil y orgánico.', st),
        bullet('Fichas de cada punto con horarios, dirección, teléfono y materiales aceptados.', st),
        bullet('Mapa interactivo con ruta de llegada al centro seleccionado.', st),
        bullet('Posibilidad de reportar nuevos puntos o actualizar información existente (participación comunitaria).', st),
        sp(8),

        Paragraph('Valor agregado', st['sub_title']),

        Table(
            [
                [Paragraph('<b>Diferenciador</b>', st['body_small']), Paragraph('<b>Detalle</b>', st['body_small'])],
                ['100 % gratuito',        'Sin registro, sin suscripción, sin publicidad intrusiva.'],
                ['Sin instalación',       'Funciona desde cualquier celular o PC con navegador.'],
                ['Datos verificados',     'Equipo de Operaciones valida y actualiza los puntos regularmente.'],
                ['Cobertura por material','Único en Córdoba con filtro simultáneo por zona y tipo de residuo.'],
                ['Impacto medible',       'Cada residuo recuperado evita emisiones de CH₄ en el relleno sanitario.'],
            ],
            colWidths=[4.5*cm, usable_w - 4.5*cm],
            style=TableStyle([
                ('BACKGROUND',   (0, 0), (-1, 0),  GREEN_LIGHT),
                ('TEXTCOLOR',    (0, 0), (-1, 0),  GREEN_DARK),
                ('FONTNAME',     (0, 0), (-1, 0),  'Helvetica-Bold'),
                ('FONTSIZE',     (0, 0), (-1, -1), 9),
                ('ROWBACKGROUNDS',(0, 1),(-1, -1), [WHITE, GRAY_100]),
                ('GRID',         (0, 0), (-1, -1), 0.4, colors.HexColor('#e5e7eb')),
                ('TOPPADDING',   (0, 0), (-1, -1), 5),
                ('BOTTOMPADDING',(0, 0), (-1, -1), 5),
                ('LEFTPADDING',  (0, 0), (-1, -1), 8),
                ('RIGHTPADDING', (0, 0), (-1, -1), 8),
                ('VALIGN',       (0, 0), (-1, -1), 'MIDDLE'),
            ])
        ),
        sp(8), hr(),
    ]

    # ────────────────────────────────────────────────
    # 3.2 — IDENTIDAD
    # ────────────────────────────────────────────────
    story += [
        sp(14),
        SectionHeader('3.2', 'Identidad de la organización', usable_w), sp(12),

        Paragraph('Nombre: GREENPOINT', st['sub_title']),
        Paragraph(
            'El nombre surge de la combinación de dos palabras en inglés de uso extendido en el ámbito '
            'ambiental: <b>Green</b> (verde), que evoca ecología, sustentabilidad y naturaleza; y '
            '<b>Point</b> (punto), que hace referencia directa al "punto verde" o centro de acopio. '
            'La unión resulta en un nombre corto, memorable, internacional y autoexplicativo: '
            '<i>el punto verde que buscabas</i>.',
            st['body']
        ),

        Paragraph('Logo y justificación', st['sub_title']),
        Paragraph(
            'El logo consiste en el símbolo universal de reciclaje (♻) inscripto en un círculo verde '
            'sólido (#16a34a). La elección es deliberada:',
            st['body']
        ),
        bullet('El símbolo ♻ es reconocido globalmente y elimina la necesidad de texto explicativo.', st),
        bullet('El círculo refuerza la idea de ciclo, continuidad y comunidad.', st),
        bullet('El verde oscuro (#16a34a) transmite seriedad institucional sin perder el vínculo ambiental.', st),
        bullet('La tipografía Inter (sans-serif moderna) aporta claridad y accesibilidad en todos los tamaños.', st),
        sp(8),

        Paragraph('Prototipo visual del producto', st['sub_title']),
        Paragraph(
            'Se desarrolló un prototipo funcional completo como página web de tres secciones:',
            st['body']
        ),

        Table(
            [
                [Paragraph('<b>Página</b>', st['body_small']), Paragraph('<b>Contenido</b>', st['body_small'])],
                ['Inicio',          'Logo, nombre, propósito, buscador y el problema que resuelve Greenpoint.'],
                ['Producto',        'Descripción del servicio, mockup interactivo, cómo funciona y materiales aceptados.'],
                ['Sobre Nosotros',  'Misión, visión, valores y organigrama funcional de la ONG.'],
            ],
            colWidths=[3.5*cm, usable_w - 3.5*cm],
            style=TableStyle([
                ('BACKGROUND',   (0, 0), (-1, 0),  GREEN_LIGHT),
                ('TEXTCOLOR',    (0, 0), (-1, 0),  GREEN_DARK),
                ('FONTNAME',     (0, 0), (-1, 0),  'Helvetica-Bold'),
                ('FONTSIZE',     (0, 0), (-1, -1), 9),
                ('ROWBACKGROUNDS',(0, 1),(-1, -1), [WHITE, GRAY_100]),
                ('GRID',         (0, 0), (-1, -1), 0.4, colors.HexColor('#e5e7eb')),
                ('TOPPADDING',   (0, 0), (-1, -1), 6),
                ('BOTTOMPADDING',(0, 0), (-1, -1), 6),
                ('LEFTPADDING',  (0, 0), (-1, -1), 8),
                ('RIGHTPADDING', (0, 0), (-1, -1), 8),
                ('VALIGN',       (0, 0), (-1, -1), 'MIDDLE'),
            ])
        ),
        sp(6),
        Paragraph(
            '<b>Link a la página web:</b>  ___________________________________________',
            st['body']
        ),
        sp(8), hr(),
    ]

    # ────────────────────────────────────────────────
    # 3.3 — MISIÓN / VISIÓN / VALORES
    # ────────────────────────────────────────────────
    story += [
        sp(14),
        SectionHeader('3.3', 'Misión, Visión y Valores', usable_w), sp(12),

        Paragraph('Misión', st['sub_title']),
        ColorBox('🎯  Misión', GREEN_LIGHT, GREEN_DARK, usable_w, 24, font_size=9),
        sp(6),
        Paragraph(
            '"Facilitar el acceso a puntos de reciclaje en Córdoba ciudad, conectando a los vecinos '
            'con los centros de acopio más cercanos según el material, para reducir la contaminación '
            'urbana y promover una cultura de cuidado ambiental en cada barrio."',
            st['quote']
        ),
        sp(6),
        Paragraph(
            '<b>Alineación con el propósito:</b> la misión traduce el propósito en acción concreta '
            '(conectar personas con puntos de reciclaje) y delimita el alcance geográfico inicial '
            '(Córdoba ciudad), lo que la hace factible y medible desde el primer día de operación.',
            st['body']
        ),
        sp(10),

        Paragraph('Visión', st['sub_title']),
        ColorBox('🔭  Visión', GREEN_LIGHT, GREEN_DARK, usable_w, 24, font_size=9),
        sp(6),
        Paragraph(
            '"Ser la plataforma de referencia en gestión de residuos comunitarios de Argentina, '
            'logrando que ningún cordobés tenga que tirar un residuo reciclable por no saber '
            'dónde llevarlo."',
            st['quote']
        ),
        sp(6),
        Paragraph(
            '<b>Alineación con el propósito:</b> la visión proyecta la misión hacia el largo plazo. '
            'Establece una meta ambiciosa pero coherente (escalar a todo el país) que orienta las '
            'decisiones estratégicas de crecimiento sin perder de vista el objetivo central: '
            'eliminar la ignorancia como barrera para el reciclaje.',
            st['body']
        ),
        sp(10),

        Paragraph('Valores', st['sub_title']),

        Table(
            [
                [
                    Paragraph('<b>🌿 Compromiso ambiental</b>', st['body_small']),
                    Paragraph('<b>🔓 Accesibilidad</b>', st['body_small']),
                ],
                [
                    Paragraph(
                        'Cada decisión de la organización se evalúa en función de su impacto ambiental. '
                        'El cuidado del planeta no es un slogan sino la brújula que orienta todas las acciones.',
                        st['body_small']
                    ),
                    Paragraph(
                        'La información es gratuita y para todos, sin barreras económicas ni tecnológicas. '
                        'Greenpoint debe ser usable por cualquier persona con un celular básico.',
                        st['body_small']
                    ),
                ],
                [
                    Paragraph('<b>🤝 Comunidad</b>', st['body_small']),
                    Paragraph('<b>📖 Transparencia</b>', st['body_small']),
                ],
                [
                    Paragraph(
                        'El cambio ambiental se construye desde el barrio. Los vecinos son protagonistas: '
                        'pueden reportar nuevos puntos y mejorar la plataforma entre todos.',
                        st['body_small']
                    ),
                    Paragraph(
                        'Greenpoint opera de forma abierta y sin fines de lucro. Los procesos de '
                        'verificación de datos y la gestión de donaciones son públicos y auditables.',
                        st['body_small']
                    ),
                ],
            ],
            colWidths=[usable_w/2, usable_w/2],
            style=TableStyle([
                ('BACKGROUND',   (0, 0), (-1, 0),  GREEN_LIGHT),
                ('BACKGROUND',   (0, 2), (-1, 2),  GREEN_LIGHT),
                ('TEXTCOLOR',    (0, 0), (-1, 0),  GREEN_DARK),
                ('TEXTCOLOR',    (0, 2), (-1, 2),  GREEN_DARK),
                ('FONTSIZE',     (0, 0), (-1, -1), 9),
                ('GRID',         (0, 0), (-1, -1), 0.4, colors.HexColor('#e5e7eb')),
                ('TOPPADDING',   (0, 0), (-1, -1), 7),
                ('BOTTOMPADDING',(0, 0), (-1, -1), 7),
                ('LEFTPADDING',  (0, 0), (-1, -1), 8),
                ('RIGHTPADDING', (0, 0), (-1, -1), 8),
                ('VALIGN',       (0, 0), (-1, -1), 'TOP'),
            ])
        ),
        sp(10),
        Paragraph(
            '<b>Alineación misión–visión–valores:</b> los cuatro valores funcionan como pilares que '
            'sostienen tanto la misión como la visión. El <i>compromiso ambiental</i> y la '
            '<i>accesibilidad</i> garantizan que la misión sea universal y gratuita. La '
            '<i>comunidad</i> y la <i>transparencia</i> hacen que la visión de largo plazo sea '
            'sostenible: una plataforma que crece con los datos que aporta la propia comunidad y que '
            'genera confianza al operar de forma abierta.',
            st['body']
        ),
        sp(8), hr(),
    ]

    # ────────────────────────────────────────────────
    # 3.4 — ORGANIGRAMA
    # ────────────────────────────────────────────────
    story += [
        sp(14),
        SectionHeader('3.4', 'Estructura y Organigrama', usable_w), sp(12),

        Paragraph(
            'Greenpoint adopta una <b>estructura funcional</b>. Este modelo agrupa a las personas '
            'según su especialidad, lo que maximiza la eficiencia en una organización pequeña donde '
            'cada integrante puede contribuir con su expertise específico. La Dirección General '
            'coordina cuatro áreas funcionales:',
            st['body']
        ),
        sp(12),
    ]

    # Organigrama como tabla visual
    cell_style = TableStyle([
        ('BACKGROUND',   (0, 0), (-1, -1), WHITE),
        ('ALIGN',        (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN',       (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING',   (0, 0), (-1, -1), 0),
        ('BOTTOMPADDING',(0, 0), (-1, -1), 0),
        ('LEFTPADDING',  (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
    ])

    def org_box(label, emoji, subtitle, bg=WHITE, border=GREEN_MED, w=3.5*cm, h=1.4*cm):
        inner = Table(
            [[Paragraph(f'<b>{emoji} {label}</b><br/><font size="7" color="#6b7280">{subtitle}</font>',
                        ParagraphStyle('ob', fontSize=8.5, leading=12, alignment=TA_CENTER, textColor=GRAY_800))]],
            colWidths=[w - 0.3*cm],
            rowHeights=[h],
            style=TableStyle([
                ('BACKGROUND',   (0,0),(-1,-1), bg),
                ('BOX',          (0,0),(-1,-1), 1, border),
                ('ROUNDEDCORNERS',(0,0),(-1,-1), [4,4,4,4]),
                ('ALIGN',        (0,0),(-1,-1), 'CENTER'),
                ('VALIGN',       (0,0),(-1,-1), 'MIDDLE'),
                ('TOPPADDING',   (0,0),(-1,-1), 4),
                ('BOTTOMPADDING',(0,0),(-1,-1), 4),
                ('LEFTPADDING',  (0,0),(-1,-1), 6),
                ('RIGHTPADDING', (0,0),(-1,-1), 6),
            ])
        )
        return inner

    top_box = org_box('DIRECCIÓN GENERAL', '🏛️', 'Coordinación estratégica',
                      bg=GREEN_LIGHT, border=GREEN_DARK, w=6*cm, h=1.5*cm)

    connector_row = Table(
        [['', '', '│', '', '']],
        colWidths=[usable_w/4, usable_w/4, 1, usable_w/4, usable_w/4],
        rowHeights=[14],
        style=TableStyle([
            ('ALIGN',(0,0),(-1,-1),'CENTER'),
            ('VALIGN',(0,0),(-1,-1),'MIDDLE'),
            ('FONTSIZE',(0,0),(-1,-1),10),
            ('TEXTCOLOR',(0,0),(-1,-1),GREEN_MED),
        ])
    )

    h_line = Table(
        [['']],
        colWidths=[usable_w * 0.72],
        rowHeights=[1],
        style=TableStyle([
            ('BACKGROUND',(0,0),(-1,-1),GREEN_MED),
            ('LEFTPADDING',(0,0),(-1,-1),0),
            ('RIGHTPADDING',(0,0),(-1,-1),0),
        ])
    )

    area_w = usable_w / 4 - 0.2*cm

    children = Table(
        [[
            org_box('Tecnología',            '💻', 'Plataforma web', w=area_w),
            org_box('Comunicación\ny Marketing', '📣', 'Difusión y redes', w=area_w),
            org_box('Operaciones',           '🗺️', 'Puntos de reciclaje', w=area_w),
            org_box('Finanzas y\nAdminist.', '💰', 'Recursos y donaciones', w=area_w),
        ]],
        colWidths=[area_w] * 4,
        style=TableStyle([
            ('ALIGN',   (0,0),(-1,-1),'CENTER'),
            ('VALIGN',  (0,0),(-1,-1),'TOP'),
            ('LEFTPADDING',(0,0),(-1,-1),4),
            ('RIGHTPADDING',(0,0),(-1,-1),4),
        ])
    )

    story += [
        Table([[top_box]], colWidths=[usable_w],
              style=TableStyle([('ALIGN',(0,0),(-1,-1),'CENTER'),('VALIGN',(0,0),(-1,-1),'MIDDLE')])),
        sp(2),
        Table([[h_line]], colWidths=[usable_w],
              style=TableStyle([('ALIGN',(0,0),(-1,-1),'CENTER'),('VALIGN',(0,0),(-1,-1),'MIDDLE')])),
        sp(4),
        children,
        sp(16),
    ]

    # Funciones detalladas
    story += [
        Paragraph('Funciones típicas de cada área', st['sub_title']),
        Table(
            [
                [Paragraph('<b>Área</b>', st['body_small']),
                 Paragraph('<b>Funciones principales</b>', st['body_small'])],
                ['💻 Tecnología',
                 'Desarrollo y mantenimiento de la plataforma web; administración de la base de datos de puntos '
                 'verdes; actualizaciones del sistema; seguridad informática y backup de datos.'],
                ['📣 Comunicación y Marketing',
                 'Gestión de redes sociales; diseño de campañas de concientización ambiental; difusión en '
                 'medios comunitarios; relaciones con escuelas, municipio y ONGs aliadas.'],
                ['🗺️ Operaciones',
                 'Relevamiento de nuevos puntos de reciclaje; verificación periódica de horarios y materiales '
                 'aceptados; coordinación con centros de acopio; respuesta a reportes de la comunidad.'],
                ['💰 Finanzas y Administración',
                 'Gestión de donaciones y subsidios; administración de recursos humanos voluntarios; '
                 'elaboración de presupuestos; rendición de cuentas pública; relaciones con sponsors.'],
            ],
            colWidths=[4*cm, usable_w - 4*cm],
            style=TableStyle([
                ('BACKGROUND',   (0, 0), (-1, 0),  GREEN_LIGHT),
                ('TEXTCOLOR',    (0, 0), (-1, 0),  GREEN_DARK),
                ('FONTNAME',     (0, 0), (-1, 0),  'Helvetica-Bold'),
                ('FONTSIZE',     (0, 0), (-1, -1), 9),
                ('ROWBACKGROUNDS',(0, 1),(-1, -1), [WHITE, GRAY_100]),
                ('GRID',         (0, 0), (-1, -1), 0.4, colors.HexColor('#e5e7eb')),
                ('TOPPADDING',   (0, 0), (-1, -1), 6),
                ('BOTTOMPADDING',(0, 0), (-1, -1), 6),
                ('LEFTPADDING',  (0, 0), (-1, -1), 8),
                ('RIGHTPADDING', (0, 0), (-1, -1), 8),
                ('VALIGN',       (0, 0), (-1, -1), 'TOP'),
            ])
        ),
        sp(6),
        Paragraph(
            '<b>Justificación de la estructura funcional:</b> dado que Greenpoint opera con equipos '
            'reducidos de voluntarios especializados, la estructura funcional permite que cada área '
            'trabaje con autonomía y eficiencia dentro de su dominio, evitando superposición de '
            'funciones. La Dirección General actúa como nexo coordinador y vocero institucional.',
            st['body']
        ),
        sp(8), hr(),
    ]

    # ────────────────────────────────────────────────
    # CONCLUSIÓN
    # ────────────────────────────────────────────────
    story += [
        sp(14),
        SectionHeader('5', 'Conclusión', usable_w), sp(12),
        Paragraph(
            'Greenpoint nace como respuesta a un problema concreto y medible: la falta de información '
            'accesible sobre puntos de reciclaje en Córdoba. Su propuesta de valor es simple pero '
            'poderosa: eliminar la excusa de "no saber dónde llevar los residuos".',
            st['body']
        ),
        Paragraph(
            'La coherencia entre misión, visión y valores garantiza que la organización opere con un '
            'norte claro: <i>facilitar</i> el acceso hoy (misión) para <i>ser la referencia nacional</i> '
            'mañana (visión), sostenida por el <i>compromiso ambiental</i>, la <i>accesibilidad</i>, '
            'la <i>comunidad</i> y la <i>transparencia</i> (valores).',
            st['body']
        ),
        Paragraph(
            'La estructura funcional elegida permite que un equipo reducido opere con eficiencia, '
            'asignando responsabilidades claras a Tecnología, Comunicación, Operaciones y Finanzas, '
            'todas coordinadas por la Dirección General.',
            st['body']
        ),
        Paragraph(
            'El prototipo web desarrollado demuestra la factibilidad técnica del servicio y sirve como '
            'herramienta de presentación ante la comunidad, donantes y organismos públicos que puedan '
            'apalancar el crecimiento de la plataforma.',
            st['body']
        ),
        sp(16),
        ColorBox(
            'Link a la página web:  _______________________________________________',
            GREEN_PALE, GREEN_DARK, usable_w, 36, font_size=9
        ),
    ]

    doc.build(story, onFirstPage=lambda c,d: None, onLaterPages=page_header_footer)
    print(f'PDF generado: {path}')


if __name__ == '__main__':
    build_pdf('/home/user/claude/informe_greenpoint.pdf')
