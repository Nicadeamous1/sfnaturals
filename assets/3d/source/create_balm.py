"""Reproducible presentation model; dimensions inferred, labels are supplied pixels.
Run: blender --background --factory-startup --python create_balm.py -- [--graybox]
"""
import bpy, math, pathlib, sys, json
from mathutils import Vector

ROOT = pathlib.Path(__file__).resolve().parents[3]
OUT = ROOT / 'assets/3d'
GRAY = '--graybox' in sys.argv
SEGMENTS = 128
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
scene = bpy.context.scene
scene.unit_settings.system = 'METRIC'
scene.render.engine = 'CYCLES'
scene.cycles.samples = 48
scene.cycles.use_denoising = True
scene.render.resolution_x = 1000
scene.render.resolution_y = 1100
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = 'PNG'
scene.render.image_settings.color_mode = 'RGBA'
scene.render.film_transparent = True
scene.view_settings.view_transform = 'AgX'
scene.render.fps = 30
scene.world.color = (.22, .22, .22)
product = bpy.data.collections.new('SF_Tallow_Balm')
scene.collection.children.link(product)

def material(name, color, rough=.4, metal=0, transmission=0):
    m=bpy.data.materials.new(name); m.diffuse_color=(*color,1); m.use_nodes=True
    p=m.node_tree.nodes.get('Principled BSDF')
    p.inputs['Base Color'].default_value=(*color,1)
    p.inputs['Roughness'].default_value=rough
    p.inputs['Metallic'].default_value=metal
    p.inputs['Transmission Weight'].default_value=transmission
    p.inputs['IOR'].default_value=1.46
    return m

amber=material('Amber cosmetic glass',(.075,.02,.004),.23,0,.35)
black=material('Satin black screw cap',(.004,.005,.004),.36,.04)
cream=material('Balm volume - illustrative',(.77,.66,.41),.63)
gold=material('Warm gold trim',(.55,.31,.085),.3,.72)
neutral=material('Graybox',(.42,.42,.42),.5)

def mesh(name,verts,faces,mat,uvs=None):
    data=bpy.data.meshes.new(name); data.from_pydata(verts,[],faces); data.update()
    obj=bpy.data.objects.new(name,data); product.objects.link(obj)
    obj.data.materials.append(neutral if GRAY else mat)
    for poly in data.polygons: poly.use_smooth=True
    if uvs:
        layer=data.uv_layers.new(name='LabelUV')
        for poly in data.polygons:
            for li,vi in zip(poly.loop_indices,poly.vertices):layer.data[li].uv=uvs[vi]
    obj['bas_role']=name
    return obj

def lathe(name,profile,mat,segments=SEGMENTS):
    verts=[]
    for radius,z in profile:
        for i in range(segments):
            a=2*math.pi*i/segments; verts.append((radius*math.sin(a),-radius*math.cos(a),z))
    faces=[]
    for j in range(len(profile)-1):
        for i in range(segments):
            ni=(i+1)%segments; faces.append((j*segments+i,j*segments+ni,(j+1)*segments+ni,(j+1)*segments+i))
    return mesh(name,verts,faces,mat)

# A real hollow vessel: rounded foot, shoulder, neck, rim, inner wall and base.
jar=lathe('Jar',[(.001,.001),(.026,.001),(.029,.0015),(.031,.003),(.032,.005),(.032,.051),(.0317,.054),(.0305,.057),(.029,.058),(.029,.063),(.0285,.064),(.0268,.064),(.0265,.063),(.0265,.009),(.025,.006),(.001,.006)],amber)
bevel=jar.modifiers.new('Soft manufactured edges','BEVEL'); bevel.width=.00035;bevel.segments=2
# Bottom seals avoid degenerate zero-radius poles.
def disc(name,r,z,mat):
    vs=[(0,0,z)]+[(r*math.sin(i*2*math.pi/SEGMENTS),-r*math.cos(i*2*math.pi/SEGMENTS),z) for i in range(SEGMENTS)]
    fs=[(0,i+1,(i+1)%SEGMENTS+1) for i in range(SEGMENTS)]
    uv=[(.5,.5)]+[(.5+v[0]/(2*r),.5+v[1]/(2*r)) for v in vs[1:]]
    return mesh(name,vs,fs,mat,uv)
disc('Jar base',.001,.001,amber)
balm=lathe('Balm',[(.001,.052),(.024,.052),(.026,.053),(.026,.054),(.023,.0546),(.001,.0547)],cream)
disc('Balm surface',.001,.0547,cream)
lidroot=bpy.data.objects.new('Lid',None);product.objects.link(lidroot)
lid=lathe('Lid shell',[(.0285,.0595),(.0318,.0595),(.0325,.0605),(.0325,.071),(.032,.0725),(.0305,.073),(.001,.073),(.001,.0708),(.0295,.0708),(.030,.070),(.030,.061),(.0285,.061),(.0285,.0595)],black)
lid.parent=lidroot
disc('Lid crown',.001,.073,black).parent=lidroot
# Fine circumferential edge bands echo the supplied smooth black closure.
for z in [.061,.062,.0705]:
    lathe('Lid edge '+str(z),[(.03248,z),(.0326,z+.00016),(.03248,z+.00032)],black).parent=lidroot
lathe('Neck thread',[(.02895,.059),(.0296,.0595),(.02895,.060),(.02895,.061),(.0296,.0615),(.02895,.062)],amber)

def labelmat(name):
    m=material('Supplied '+name+' label',(.3,.1,.05),.75)
    nodes=m.node_tree.nodes; nodes.get('Principled BSDF').inputs['Specular IOR Level'].default_value=.15; tex=nodes.new('ShaderNodeTexImage')
    tex.image=bpy.data.images.load(str(OUT/'textures'/('balm-'+name+'.png')))
    tex.image.pack();m.node_tree.links.new(tex.outputs['Color'],nodes.get('Principled BSDF').inputs['Base Color'])
    noise=nodes.new('ShaderNodeTexNoise');noise.inputs['Scale'].default_value=800
    bump=nodes.new('ShaderNodeBump');bump.inputs['Strength'].default_value=.06;bump.inputs['Distance'].default_value=.00006
    m.node_tree.links.new(noise.outputs['Fac'],bump.inputs['Height']);m.node_tree.links.new(bump.outputs['Normal'],nodes.get('Principled BSDF').inputs['Normal'])
    return m

def arc_label(name,center,mat):
    verts=[];uv=[];n=48
    for j,z in enumerate([.007,.0515]):
        for i in range(n+1):
            a=center+(i/n-.5)*2.10
            verts.append((.03213*math.sin(a),-.03213*math.cos(a),z));uv.append((i/n,j))
    return mesh(name,verts,[(i,i+1,n+2+i,n+1+i) for i in range(n)],mat,uv)

arc_label('FrontLabel',0,labelmat('front'))
arc_label('BackLabel',math.pi,labelmat('back'))
top=disc('TopLabel',.027,.07308,labelmat('top'));top.parent=lidroot

def camera(name,location,target,ortho=.125):
    data=bpy.data.cameras.new(name);obj=bpy.data.objects.new(name,data);scene.collection.objects.link(obj)
    obj.location=location;obj.rotation_euler=(Vector(target)-obj.location).to_track_quat('-Z','Y').to_euler();data.type='ORTHO';data.ortho_scale=ortho
    return obj
hero=camera('HeroCamera',(.035,-.25,.125),(0,0,.038),.115)
camera('ReferenceCamera',(0,-.25,.086),(0,0,.036),.101)
scene.camera=hero
def area(name,location,power,size,color):
    d=bpy.data.lights.new(name,'AREA');d.energy=power;d.shape='DISK';d.size=size;d.color=color
    o=bpy.data.objects.new(name,d);scene.collection.objects.link(o);o.location=location;o.rotation_euler=(Vector((0,0,.04))-o.location).to_track_quat('-Z','Y').to_euler()
area('Warm softbox',(-.1,-.12,.18),.8,.13,(1,.87,.67))
area('Neutral fill',(.13,-.06,.11),.45,.10,(.83,.91,1))
area('Amber rim',(.02,.09,.14),1,.085,(1,.73,.40))
scene.world.use_nodes=True;scene.world.node_tree.nodes['Background'].inputs[0].default_value=(.3,.3,.3,1)
scene.world.node_tree.nodes['Background'].inputs[1].default_value=.18
for o in product.objects:o.select_set(False)
OUT.joinpath('previews').mkdir(exist_ok=True)
if GRAY:
    scene.render.resolution_percentage=50
    scene.render.filepath=str(OUT/'previews/graybox.png');bpy.ops.render.render(write_still=True)
else:
    bpy.ops.wm.save_as_mainfile(filepath=str(OUT/'source/tallow-balm.blend'))
    bpy.ops.object.select_all(action='DESELECT')
    for obj in product.objects:obj.select_set(True)
    bpy.ops.export_scene.gltf(filepath=str(OUT/'exports/tallow-balm.raw.glb'),export_format='GLB',use_selection=True,export_apply=True,export_yup=True)
    scene.render.filepath=str(OUT/'previews/tallow-balm-hero.png');bpy.ops.render.render(write_still=True)
    lidroot.location.z=.024
    scene.render.filepath=str(OUT/'previews/tallow-balm-open.png');bpy.ops.render.render(write_still=True)
print('SF_BALM_BUILD_COMPLETE')



