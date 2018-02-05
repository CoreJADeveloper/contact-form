<?php
namespace WPCONTACTFORM;
/**
 * Plugin Name: WordPress Contact Form
 * Author: Tauhidul Alam
 * Description: A contact form :(
 */


class ngContactForm
{

    protected static $_instance = null;

    public static function instance()
    {
        if (is_null(self::$_instance)) {
            self::$_instance = new self();
        }

        return self::$_instance;
    }

    public function __construct()
    {
        $this->_actions();
        $this->_define();
        $this->_require();
    }

    private function _require(){
        if(is_admin()){
            require_once ANGCF_PLUGIN_PATH. 'includes/admin/class-form-listing.php';
        }
    }

    private function _define()
    {
        define('ANGCF_PLUGIN_PATH', plugin_dir_path(__FILE__));
        define('ANGCF_PLUGIN_URL', plugins_url('/', __FILE__));
    }

    private function _actions()
    {
        add_action('admin_enqueue_scripts', array($this, 'admin_enqueue_scripts'));
        add_action('init', array($this, 'register_contact_form_post_type'));
        add_action('admin_menu', array($this, 'admin_contact_form_menu'));
    }

    public function admin_enqueue_scripts()
    {
        if (isset($_GET['page']) && $_GET['page'] == 'ng-add-form') {
            wp_enqueue_script('ang-script', ANGCF_PLUGIN_URL . 'dist/app.bundle.js', array(), '1.1.1', true);
            wp_enqueue_style('dragula-style', ANGCF_PLUGIN_URL . 'dist/dragula.min.css');
            wp_enqueue_style('material-icons', 'https://fonts.googleapis.com/icon?family=Material+Icons');
            wp_enqueue_style('ang-style', ANGCF_PLUGIN_URL . 'dist/styles.css');
        }
    }

    public function register_contact_form_post_type()
    {
        $labels = array(
            'name' => _x('NG Contact Forms', 'post type general name', 'your-plugin-textdomain'),
            'singular_name' => _x('NG Contact Form', 'post type singular name', 'your-plugin-textdomain'),
            'menu_name' => _x('NG Contact Forms', 'admin menu', 'your-plugin-textdomain'),
            'name_admin_bar' => _x('NG Contact Form', 'add new on admin bar', 'your-plugin-textdomain'),
            'add_new' => _x('Add New', 'ang-contact', 'your-plugin-textdomain'),
            'add_new_item' => __('Add New ', 'your-plugin-textdomain'),
            'new_item' => __('New Contact Form', 'your-plugin-textdomain'),
            'edit_item' => __('Edit Contact Form', 'your-plugin-textdomain'),
            'view_item' => __('View Contact Form', 'your-plugin-textdomain'),
            'all_items' => __('All Contact Forms', 'your-plugin-textdomain'),
            'search_items' => __('Search Contact Form', 'your-plugin-textdomain'),
            'parent_item_colon' => __('Parent Contact Form:', 'your-plugin-textdomain'),
            'not_found' => __('No Contact Form found.', 'your-plugin-textdomain'),
            'not_found_in_trash' => __('No Contact Form found in Trash.', 'your-plugin-textdomain')
        );

        $args = array(
            'labels' => $labels,
            'description' => __('Description.', 'your-plugin-textdomain'),
            'public' => true,
            'publicly_queryable' => true,
            'show_ui' => false,
            'show_in_menu' => true,
            'query_var' => true,
            'rewrite' => array('slug' => 'ang-contact'),
            'capability_type' => 'post',
            'has_archive' => true,
            'hierarchical' => false,
            'menu_position' => null,
            'supports' => array('title', 'editor', 'author', 'thumbnail', 'excerpt', 'comments')
        );

        register_post_type('angular-forms', $args);
    }

    public function admin_contact_form_menu()
    {
        add_menu_page(
            __('ngContact Form', 'ngForms'),
            __('ngContact Form', 'ngForms'),
            'manage_options',
            'ng-forms',
            array($this, 'angular_forms'),
            'dashicons-feedback',
            apply_filters('ngForms_menu_position', '57.7'));
        add_submenu_page(
            'ng-forms',
            __('ngContact Form', 'ngForms'),
            __('All Forms', 'ngForms'),
            'manage_options',
            'ng-forms',
            array($this, 'angular_forms'));
        add_submenu_page(
            'ng-forms',
            __('ngContact Form', 'ngForms'),
            __('Add Form', 'ngForms'),
            'manage_options', 'ng-add-form',
            array($this, 'angular_add_form'));
        add_submenu_page(
            'ng-forms',
            __('ngContact Form', 'ngForms'),
            __('Settings', 'ngForms'),
            'manage_options',
            'ng-settings',
            array($this, 'angular_settings'));
    }

    public function angular_forms()
    {
        do_action('ng_forms_admin_page');
    }

    public function angular_add_form()
    {
        ?>
        <contact-form>
            Loading....
        </contact-form>
        <?php
    }

    public function angular_settings(){

    }
}

function contact_form()
{
    return ngContactForm::instance();
}

$GLOBALS['contact_form'] = contact_form();