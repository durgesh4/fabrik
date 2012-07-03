<?php
/**
 * @package     Joomla.Administrator
 * @subpackage  Fabrik
 * @copyright   Copyright (C) 2005 Fabrik. All rights reserved.
 * @license     http://www.gnu.org/copyleft/gpl.html GNU/GPL, see LICENSE.php
 * @since       1.6
 */

defined('_JEXEC') or die;

jimport('joomla.application.component.modellist');

/**
 * Fabrik Connections Model
 * 
 * @package  Fabrik
 * @since    3.0
 */

class FabrikModelConnections extends JModelList
{

	/**
	 * Constructor.
	 *
* @param   array  $config  An optional associative array of configuration settings.
	 */

	public function __construct($config = array())
	{
		if (empty($config['filter_fields']))
		{
			$config['filter_fields'] = array('c.id');
		}
		parent::__construct($config);
	}

	/**
	 * Build an SQL query to load the list data.
	 *
	 * @return  JDatabaseQuery
	 * 
	 * @since	1.6
	 */

	protected function getListQuery()
	{
		// Initialise variables.
		$db = $this->getDbo();
		$query = $db->getQuery(true);

		// Select the required fields from the table.
		$query->select($this->getState('list.select', 'c.*'));
		$query->from('#__fabrik_connections AS c');

		$published = $this->getState('filter.published');
		if (is_numeric($published))
		{
			$query->where('c.published = ' . (int) $published);
		}
		elseif ($published === '')
		{
			$query->where('(c.published IN (0, 1))');
		}

		// Filter by search in title
		$search = $this->getState('filter.search');
		if (!empty($search))
		{
			$search = $db->quote('%' . $db->getEscaped($search, true) . '%');
			$query->where('(c.host LIKE ' . $search . ' OR c.database OR c.description LIKE ' . $search . ')');
		}

		// Join over the users for the checked out user.
		$query->select('u.name AS editor');
		$query->join('LEFT', '#__users AS u ON checked_out = u.id');

		// Add the list ordering clause.
		$orderCol = $this->state->get('list.ordering');
		$orderDirn = $this->state->get('list.direction');
		if ($orderCol == 'ordering' || $orderCol == 'category_title')
		{
			$orderCol = 'category_title ' . $orderDirn . ', ordering';
		}
		$query->order($db->getEscaped($orderCol . ' ' . $orderDirn));
		return $query;
	}

	/**
	 * Returns a reference to the a Table object, always creating it.
	 *
* @param   string  $type    The table type to instantiate
* @param   string  $prefix  A prefix for the table class name. Optional.
* @param   array   $config  Configuration array for model. Optional.
	 * 
	 * @return  JTable  A database object
	 * 
	 * @since	1.6
	 */

	public function getTable($type = 'Connection', $prefix = 'FabrikTable', $config = array())
	{
		$config['dbo'] = FabriKWorker::getDbo();
		return FabTable::getInstance($type, $prefix, $config);
	}

	/**
	 * Method to auto-populate the model state.
	 *
	 * Note. Calling getState in this method will result in recursion.
	 * 
* @param   string  $ordering   An optional ordering field.
* @param   string  $direction  An optional direction (asc|desc).
	 * 
	 * @since	1.6
	 * 
	 * @return  void
	 */

	protected function populateState($ordering = null, $direction = null)
	{
		// Initialise variables.
		$app = JFactory::getApplication('administrator');

		// Load the parameters.
		$params = JComponentHelper::getParams('com_fabrik');
		$this->setState('params', $params);
		$published = $app->getUserStateFromRequest($this->context . '.filter.published', 'filter_published', '');
		$this->setState('filter.published', $published);
		$search = $app->getUserStateFromRequest($this->context . '.filter.search', 'filter_search');
		$this->setState('filter.search', $search);

		// List state information.
		parent::populateState('name', 'asc');
	}

	/**
	 * Get list of active connections
	 * 
	 * @return  array connection items
	 */

	public function activeConnections()
	{
		$db = $this->getDbo();
		$query = $db->getQuery(true);
		$query->select('*')->from('#__fabrik_connections')->where('published = 1');
		$items = $this->_getList($query);
		return $items;
	}
}
