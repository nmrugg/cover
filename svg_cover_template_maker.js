var trim = 0.125,
    safety = 0.125,
    thicknesses = {
        white: 0.002252,
        cream: 0.0025,
        color: 0.002347
    };

function create_grid(w, h, spine, pw, pc)
{
    var grid_str = "",
        c = -1,
        light_op = 0.15,
        dark_op = 0.3,
        center = w / 2,
        half_spine = spine / 2,
        trim_line_color = "0000ff",
        center_line_color = "ffff00",
        half_pw = pw / 2;
    
    function get_grid_svg(x, y, color, opacity)
    {
        if (!opacity) {
            opacity = 1;
        }
        c += 1;
        return "<inkscape:grid originx=\"" + x + "in\" originy=\"" + y + "in\" empcolor=\"#" + color + "\" empopacity=\"" + opacity + "\" color=\"#" + color + "\" opacity=\"" + opacity + "\" type=\"xygrid\" id=\"grid" + c + "\" empspacing=\"5\" visible=\"true\" enabled=\"true\" snapvisiblegridlinesonly=\"false\" dotted=\"false\" spacingx=\"100in\" spacingy=\"100in\" units=\"in\"/>";
    }
    
    /// Mark Trim
    grid_str += get_grid_svg(trim, trim, trim_line_color, dark_op);
    grid_str += get_grid_svg(w - trim, h - trim, trim_line_color, dark_op);
    
    /// Mark Safe area
    grid_str += get_grid_svg(trim + safety, trim + safety, trim_line_color, light_op);
    grid_str += get_grid_svg(w - trim - safety, h - trim - safety, trim_line_color, light_op);
    
    /// Mark spine
    if (pc > 100) {
        grid_str += get_grid_svg(center - half_spine, 0, trim_line_color, dark_op);
        grid_str += get_grid_svg(center + half_spine, 0, trim_line_color, dark_op);
        grid_str += get_grid_svg(center - half_spine + safety, 0, trim_line_color, light_op);
        grid_str += get_grid_svg(center + half_spine - safety, 0, trim_line_color, light_op);
    }
    
    /// Add saftey lines from center
    grid_str += get_grid_svg(center - half_spine - safety, 0, trim_line_color, light_op);
    grid_str += get_grid_svg(center + half_spine + safety, 0, trim_line_color, light_op);
    
    /// Mark page centers
    grid_str += get_grid_svg(center, 0, center_line_color, light_op);
    grid_str += get_grid_svg(half_pw + trim, 0, center_line_color, dark_op);
    grid_str += get_grid_svg(center + half_spine + half_pw, 0, center_line_color, dark_op);
    
    return grid_str;
}

function create_svg(w, h, spine, pw, pc)
{
    var svg_head = "<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\" xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\" width=\"" + w + "in\" height=\"" + h + "in\">",
        svg_namedview_start = "<sodipodi:namedview units=\"in\" pagecolor=\"#ffffff\" showgrid=\"true\">"
        svg_namedview_end = "</sodipodi:namedview>",
        svg_end = "</svg>";
    
    return svg_head + svg_namedview_start + create_grid(w, h, spine, pw, pc) + svg_namedview_end + svg_end;
}

function generate(pw, ph, pc, pt)
{
    var thickness,
        h,
        w,
        spine;
    
    if (!pw || !ph || !pc) {
        console.log("Need page width, height, and count.")
        return 1;
    }
    
    pw = Number(pw);
    ph = Number(ph);
    pc = Number(pc);
    
    if (!pt) {
        pt = "white";
    }
    
    thickness = thicknesses[pt];
    
    if (!thickness) {
        console.log("Page type " + pt + " is unknown. Please choose from white, cream, or color.")
        return 2;
    }
    
    spine = pc * thickness;
    w = trim + pw + spine + pw + trim;
    h = trim + ph + trim;
    
    return create_svg(w, h, spine, pw, pc)
}

if (typeof module !== "undefined") {
    /// Was this called directly?
    if (require.main === module) {
        console.log(generate(process.argv[2], process.argv[3], process.argv[4], process.argv[5]));
    } else {
        module.exports = generate;
    }
}
