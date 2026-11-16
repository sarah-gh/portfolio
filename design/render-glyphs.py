import bpy
from mathutils import Vector
from pathlib import Path

root = Path(__file__).resolve().parent.parent
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.render.engine = 'CYCLES'
scene.cycles.samples = 20
scene.cycles.use_denoising = True
scene.render.resolution_x = 448
scene.render.resolution_y = 448
scene.render.resolution_percentage = 100
scene.render.film_transparent = True
scene.render.image_settings.color_mode = 'RGBA'
scene.world = bpy.data.worlds.new('Ambient')
scene.world.color = (0.15, 0.15, 0.15)

def aim(obj, point):
    obj.rotation_euler = (Vector(point) - obj.location).to_track_quat('-Z', 'Y').to_euler()

bpy.ops.object.camera_add(location=(0, 0, 5))
scene.camera = bpy.context.object
aim(scene.camera, (0, 0, 0))
scene.camera.data.type = 'ORTHO'
scene.camera.data.ortho_scale = 2.55

for name, pos, color, energy in [
    ('Violet', (-3, 2, 3), (0.45, 0.19, 1), 540),
    ('Cyan', (3, 0, 2), (0.12, 0.72, 1), 480),
    ('Pink', (-1, -3, 1), (1, 0.15, 0.56), 400),
]:
    bpy.ops.object.light_add(type='AREA', location=pos)
    light = bpy.context.object
    light.name = name
    light.data.color = color
    light.data.energy = energy
    light.data.size = 3
    aim(light, (0, 0, 0))

material = bpy.data.materials.new('Violet metal')
material.use_nodes = True
shader = material.node_tree.nodes.get('Principled BSDF')
shader.inputs['Base Color'].default_value = (0.25, 0.12, 0.43, 1)
shader.inputs['Metallic'].default_value = 0.68
shader.inputs['Roughness'].default_value = 0.26

glyphs = []
for name, glyph, rotation in [
    ('brace', '}', (0.22, -0.48, -0.25)),
    ('chevron', '>', (-0.23, 0.44, 0.18)),
    ('hash', '#', (0.3, -0.38, -0.26)),
    ('slash', '/', (-0.31, 0.36, -0.28)),
]:
    curve = bpy.data.curves.new(name, 'FONT')
    curve.body = glyph
    curve.align_x = 'CENTER'
    curve.align_y = 'CENTER'
    curve.size = 2.45
    curve.extrude = 0.11
    curve.bevel_depth = 0.035
    obj = bpy.data.objects.new(name, curve)
    scene.collection.objects.link(obj)
    obj.rotation_euler = rotation
    obj.data.materials.append(material)
    glyphs.append(obj)

for obj in glyphs:
    for other in glyphs:
        other.hide_render = other != obj
    scene.render.filepath = str(root / 'public' / 'scene' / (obj.name + '.png'))
    bpy.ops.render.render(write_still=True)

for index, obj in enumerate(glyphs):
    obj.hide_render = False
    obj.location.x = (index - 1.5) * 2
scene.camera.data.ortho_scale = 9
bpy.ops.wm.save_as_mainfile(filepath=str(root / 'design' / 'code-glyphs.blend'))
