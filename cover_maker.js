/// Nathan Rugg (c) 2017
/// License: MIT (nate.mit-license.org)
/// Kindle Direct Publishing cover generator

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
        center_line_color = "eeee00",
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
    grid_str += get_grid_svg(center, 0, center_line_color, dark_op);
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
    
    pw = Number(pw);
    ph = Number(ph);
    pc = Number(pc);
    
    if (!pw || !ph || !pc) {
        return new Error("Need page width (in inches), height, and count.\nUsage: page_width page_height page_count [page_type]");
    }
    
    /// Make page count even since each page has two sides.
    pc += pc % 2
    
    if (!pt) {
        pt = "white";
    }
    
    thickness = thicknesses[pt];
    
    if (!thickness) {
        return new Error("Page type " + pt + " is unknown. Please choose from white, cream, or color.");
    }
    
    spine = pc * thickness;
    w = trim + pw + spine + pw + trim;
    h = trim + ph + trim;
    
    return create_svg(w, h, spine, pw, pc);
}

function color(color_code, str)
{
    return "\u001B[" + color_code + "m" + str + "\u001B[0m";
}

function highlight(str)
{
    return color(33, str);
}

function note(str)
{
    return color(36, str);
}

if (typeof module === "object") {
    generate.generate = generate;
    generate.highlight = highlight;
    generate.note = note;
    module.exports = generate;

    /// Was this called directly?
    if (typeof require === "function" && require.main === module) {
        if (require.main === module && process.argv[2] && process.argv[3] && process.argv[4]) {
            console.log(generate(process.argv[2], process.argv[3], process.argv[4], process.argv[5]));
        } else {
            if (process.argv[2] || process.argv[3] || process.argv[4]) {
                console.log("Invalid input");
            }
            console.log("");
            console.log("Usage: " + highlight("cover_maker.js") + " " + note("Page_Width") + " " + note("Page_Height") + " " + note("Page_Count") + " [" + note("Page_Type") + "]");
            console.log("");
            console.log(note("Page_Width") + " and " + note("Page_Height") + " must be in inches.");
            console.log(note("Page_Count") + " is the total number of pages in the book (each leaf is two pages).");
            console.log(note("Page_Type") + " can be " + highlight("white") + ", " + highlight("cream") + ", or " + highlight("color") + ".");
            console.log(note("Page_Type") + " defaults to " + highlight("white") + ".");
            console.log("");
        }
    }
}
