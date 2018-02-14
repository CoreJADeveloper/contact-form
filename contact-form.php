<?php

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
        global $endpoint;
        $endpoint = site_url('/wp-json/');

        $this->_actions();
        $this->_define();
        $this->_require();
    }

    private function _require()
    {
        if (is_admin()) {
            require_once ANGCF_PLUGIN_PATH . 'includes/admin/class-form-listing.php';
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

        add_action('rest_api_init', function () {
            register_rest_route('angular-forms/v1', '/create-post/', array(
                'methods' => 'POST',
                'callback' => array($this, 'create_custom_post'),
                'permission_callback' => function () {
                    return current_user_can('edit_others_posts');
                }
            ));
        });

        add_action('rest_api_init', function () {
            register_rest_route('angular-forms/v1', '/get-post/', array(
                'methods' => 'POST',
                'callback' => array($this, 'get_created_post_data'),
                'permission_callback' => function () {
                    return current_user_can('edit_others_posts');
                }
            ));
        });
    }

    public function get_created_post_data(WP_REST_Request $request){
        $parameters = $request->get_params();

        $form_id = $parameters['form_id'];

        $data['form_title'] = get_the_title($form_id);
        $data['form_type'] = get_post_meta($form_id, 'ng_default_form_type', true);
        $data['form_fields'] = get_post_meta($form_id, 'ng_form_fields', true);
        $data['settings_data'] = get_post_meta($form_id, 'ng_form_settings', true);

        return wp_json_encode($data);
    }

    public function create_custom_post(WP_REST_Request $request)
    {
        $parameters = $request->get_params();

        $title = $parameters['title'];
        $content = $parameters['content'];
        $status = $parameters['status'];
        $meta = $parameters['meta'];
        $default_form_type = $meta['default_form_type'];
        $form_fields= $meta['form_fields'];
        $settings_data= $meta['settings_data'];

        $angular_form_post = array(
            'post_title' => $title,
            'post_type' => 'angular-forms',
            'post_content' => $content,
            'post_status' => $status,
            'post_author' => get_current_user_id(),
        );

        $angular_form_post_id = wp_insert_post($angular_form_post);

        update_post_meta($angular_form_post_id, 'ng_default_form_type', $default_form_type);
        update_post_meta($angular_form_post_id, 'ng_form_fields', $form_fields);
        update_post_meta($angular_form_post_id, 'ng_form_settings', $settings_data);

        $redirect_url = admin_url('/admin.php?page=ng-edit-form&id=' . $angular_form_post_id);

        return $redirect_url;
    }

    public function admin_enqueue_scripts()
    {
        if (isset($_GET['page']) && ($_GET['page'] == 'ng-add-form' || $_GET['page'] == 'ng-edit-form' || $_GET['page'] == 'ng-settings')) {
            wp_enqueue_script('ang-script', ANGCF_PLUGIN_URL . 'dist/app.bundle.js', array(), '1.1.1', true);
            wp_enqueue_style('dragula-style', ANGCF_PLUGIN_URL . 'dist/dragula.min.css');
            wp_enqueue_style('material-icons', 'https://fonts.googleapis.com/icon?family=Material+Icons');
            wp_enqueue_style('ang-style', ANGCF_PLUGIN_URL . 'dist/styles.css');
        }
    }

    public function register_contact_form_post_type()
    {
        $labels = array(
            'name' => _x('NG Contact Forms', 'post type general name', 'ngForms'),
            'singular_name' => _x('NG Contact Form', 'post type singular name', 'ngForms'),
            'menu_name' => _x('NG Contact Forms', 'admin menu', 'ngForms'),
            'name_admin_bar' => _x('NG Contact Form', 'add new on admin bar', 'ngForms'),
            'add_new' => _x('Add New', 'ang-contact', 'ngForms'),
            'add_new_item' => __('Add New ', 'ngForms'),
            'new_item' => __('New Contact Form', 'ngForms'),
            'edit_item' => __('Edit Contact Form', 'ngForms'),
            'view_item' => __('View Contact Form', 'ngForms'),
            'all_items' => __('All Contact Forms', 'ngForms'),
            'search_items' => __('Search Contact Form', 'ngForms'),
            'parent_item_colon' => __('Parent Contact Form:', 'ngForms'),
            'not_found' => __('No Contact Form found.', 'ngForms'),
            'not_found_in_trash' => __('No Contact Form found in Trash.', 'ngForms')
        );

        $args = array(
            'labels' => $labels,
            'description' => __('Description.', 'ngForms'),
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
        $edit_hook = add_submenu_page(
            null,
            __('ngContact Form', 'ngForms'),
            __('Edit Form', 'ngForms'),
            'manage_options',
            'ng-edit-form',
            array($this, 'angular_edit_form'));

        add_action("admin_footer-$edit_hook", function () {
            echo <<<EOF
                <script type="text/javascript">
                    var ng_forms_element = document.getElementById("toplevel_page_ng-forms");
                    ng_forms_element.className += ' current wp-has-current-submenu wp-menu-open';
                </script>
EOF;
        });
    }

    public function angular_edit_form()
    {
        global $endpoint;
        $form_id = $_GET['id'];

        if (isset($form_id) && !empty($form_id) && get_post_status ( $form_id )) {
            $data['form_title'] = get_the_title($form_id);
            $data['form_type'] = get_post_meta($form_id, 'ng_default_form_type', true);
            $data['form_fields'] = get_post_meta($form_id, 'ng_form_fields', true);
            $data['settings_data'] = get_post_meta($form_id, 'ng_form_settings', true);

            ?>
            <script>
                sessionStorage.setItem('ng_form_title', '<?php echo html_entity_decode($data['form_title'])?>');
                sessionStorage.setItem('ng_form_type', '<?php echo html_entity_decode($data['form_type'])?>');
                sessionStorage.setItem('ng_form_fields', '<?php echo html_entity_decode($data['form_fields'])?>');
                sessionStorage.setItem('ng_settings_data', '<?php echo html_entity_decode($data['settings_data'])?>');
            </script>
            <contact-form type="edit" form_id="<?php echo $form_id?>" endpoint="<?php echo $endpoint ?>"
                          nonce="<?php echo wp_create_nonce('wp_rest') ?>">
                Loading....
            </contact-form>
            <?php
        }
    }

    public function angular_forms()
    {
        do_action('ng_forms_admin_page');
    }

    public function angular_add_form()
    {
        global $endpoint;
        ?>
        <contact-form type="add" endpoint="<?php echo $endpoint ?>" nonce="<?php echo wp_create_nonce('wp_rest') ?>">
            Loading....
        </contact-form>
        <?php
    }

    public function angular_settings()
    {
        global $endpoint;
        ?>
        <contact-form type="settings" endpoint="<?php echo $endpoint ?>" nonce="<?php echo wp_create_nonce('wp_rest') ?>">
            Loading....
        </contact-form>
        <?php
    }
}

function contact_form()
{
    return ngContactForm::instance();
}

$GLOBALS['contact_form'] = contact_form();