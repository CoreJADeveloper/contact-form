<?php
namespace WPCONTACTFORM;
/**
 * Plugin Name: WordPress Contact Form
 * Author: Tauhidul Alam
 * Description: A contact form :(
 */


class ContactForm{

    protected static $_instance = null;

    public static function instance(){
        if(is_null(self::$_instance)){
            self::$_instance = new self();
        }

        return self::$_instance;
    }

    public function __construct()
    {
        $this->_actions();
    }

    private function _actions(){
        add_action('admin_enqueue_scripts', array($this, 'admin_enqueue_scripts'));
        add_action( 'init', array($this, 'register_contact_form_post_type'));
    }

    public function admin_enqueue_scripts(){
        wp_enqueue_script('script', plugins_url('dist/app.bundle.js', __DIR__));
    }

    public function register_contact_form_post_type(){
        $labels = array(
            'name'               => _x( 'Contact Forms', 'post type general name', 'your-plugin-textdomain' ),
            'singular_name'      => _x( 'Contact Form', 'post type singular name', 'your-plugin-textdomain' ),
            'menu_name'          => _x( 'Contact Forms', 'admin menu', 'your-plugin-textdomain' ),
            'name_admin_bar'     => _x( 'Contact Form', 'add new on admin bar', 'your-plugin-textdomain' ),
            'add_new'            => _x( 'Add New', 'ang-contact', 'your-plugin-textdomain' ),
            'add_new_item'       => __( 'Add New ', 'your-plugin-textdomain' ),
            'new_item'           => __( 'New Contact Form', 'your-plugin-textdomain' ),
            'edit_item'          => __( 'Edit Contact Form', 'your-plugin-textdomain' ),
            'view_item'          => __( 'View Contact Form', 'your-plugin-textdomain' ),
            'all_items'          => __( 'All Contact Forms', 'your-plugin-textdomain' ),
            'search_items'       => __( 'Search Contact Form', 'your-plugin-textdomain' ),
            'parent_item_colon'  => __( 'Parent Contact Form:', 'your-plugin-textdomain' ),
            'not_found'          => __( 'No Contact Form found.', 'your-plugin-textdomain' ),
            'not_found_in_trash' => __( 'No Contact Form found in Trash.', 'your-plugin-textdomain' )
        );

        $args = array(
            'labels'             => $labels,
            'description'        => __( 'Description.', 'your-plugin-textdomain' ),
            'public'             => true,
            'publicly_queryable' => true,
            'show_ui'            => false,
            'show_in_menu'       => true,
            'query_var'          => true,
            'rewrite'            => array( 'slug' => 'ang-contact' ),
            'capability_type'    => 'post',
            'has_archive'        => true,
            'hierarchical'       => false,
            'menu_position'      => null,
            'supports'           => array( 'title', 'editor', 'author', 'thumbnail', 'excerpt', 'comments' )
        );

        register_post_type( 'ang-contact', $args );
    }

}

function contact_form(){
    return ContactForm::instance();
}

$GLOBALS['contact_form'] = contact_form();