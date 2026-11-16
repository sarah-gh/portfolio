"""Exports extruded, bevelled code glyphs as one GLB for the Three.js hero scene.

Run:  blender --background --python design/export-glyphs.py
Output: public/models/glyphs.glb  (one mesh per glyph, named glyph_<name>, centred at origin)
"""
import bpy
from pathlib import Path

root = Path(__file__).resolve().parent.parent
out = root / 'public' / 'models' / 'glyphs.glb'
out.parent.mkdir(parents=True, exist_ok=True)

bpy.ops.wm.read_factory_settings(use_empty=True)

GLYPHS = [
    ('brace_open', '{'),
    ('brace_close', '}'),
    ('chevron_left', '<'),
    ('chevron_right', '>'),
    ('slash', '/'),
    ('hash', '#'),
    ('semicolon', ';'),
    ('at', '@'),
]

for name, glyph in GLYPHS:
    curve = bpy.data.curves.new(name, 'FONT')
    curve.body = glyph
    curve.align_x = 'CENTER'
    curve.align_y = 'CENTER'
    curve.size = 1.0
    curve.extrude = 0.09
    curve.bevel_depth = 0.022
    curve.bevel_resolution = 3
    curve.resolution_u = 8
    obj = bpy.data.objects.new(f'glyph_{name}', curve)
    bpy.context.scene.collection.objects.link(obj)

    bpy.ops.object.select_all(action='DESELECT')
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.convert(target='MESH')
    bpy.ops.object.origin_set(type='ORIGIN_GEOMETRY', center='BOUNDS')
    obj.location = (0, 0, 0)
    bpy.ops.object.shade_auto_smooth(angle=0.6)

bpy.ops.object.select_all(action='SELECT')
bpy.ops.export_scene.gltf(
    filepath=str(out),
    export_format='GLB',
    use_selection=True,
    export_materials='NONE',
    export_yup=True,
    export_apply=True,
)
print('Exported', out)
